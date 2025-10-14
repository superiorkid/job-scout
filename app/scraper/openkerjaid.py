import asyncio
import re
import time
from asyncio import Semaphore
from datetime import datetime, timezone
from pprint import pprint
from urllib.parse import urljoin

import aiohttp
from aiohttp import ClientSession
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.constants import HEADERS, SEM_LIMIT
from app.models import JobPosting, Specification, Position, JobProvider
from app.scraper.service import fetch_sitemap

BASE_URL = "https://www.openkerja.id"
SITEMAP_INDEX_URL = "https://www.openkerja.id/sitemap_index.xml"
SITEMAP_TARGET = "post-sitemap"

AD_CLASSES = {"dlpro-banner-beforecontent", "dlpro-banner-insidecontent"}

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(r"(\+62|62|0)(\d{8,12})")

JOB_TITLE_PATTERN = re.compile(r"^\d+\.", re.IGNORECASE)
SUBJECT_PATTERN = re.compile(r"subject\s*[:\-]", re.IGNORECASE)
EMAIL_PATTERN = re.compile(r"[\w\.-]+@[\w\.-]+\.\w+")


def extract_contact_from_paragraphs(desc_div: BeautifulSoup):
    paragraphs = desc_div.find_all("p")
    if not paragraphs:
        return None, None

    # Find the paragraph containing "Baca:"
    baca_index = None
    for i, p in enumerate(paragraphs):
        if "Baca:" in p.get_text():
            baca_index = i
            break

    # Only consider paragraphs after "Baca:"
    contact_paragraphs = paragraphs[baca_index + 1:] if baca_index is not None else paragraphs

    email = None
    phone = None

    for p in contact_paragraphs:
        text = p.get_text(" ", strip=True)

        if not email:
            email_match = EMAIL_REGEX.search(text)
            if email_match:
                email = email_match.group(0)

        if not phone:
            phone_match = PHONE_REGEX.search(text)
            if phone_match:
                phone = phone_match.group(0)

        # Stop early if both found
        if email and phone:
            break

    return email, phone


def extract_job_sections(description_div: BeautifulSoup):
    job_sections = []

    for strong_tag in description_div.find_all("strong"):
        text = strong_tag.get_text(" ", strip=True)

        if not JOB_TITLE_PATTERN.match(text):
            continue
        if EMAIL_PATTERN.search(text):
            continue
        start_p = strong_tag.find_parent("p")
        if not start_p:
            continue

        clean_title = re.sub(r"^\d+\.\s*", "", text).strip()
        job_sections.append(clean_title)

    return job_sections


async def fetch_final_redirect(session: ClientSession, apply_link: str):
    final_url = urljoin(BASE_URL, apply_link)
    try:
        async with session.get(final_url, headers=HEADERS, allow_redirects=True) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            onclick_link = soup.select_one('a[onclick*="location.href"]')
            if onclick_link and "onclick" in onclick_link.attrs:
                match = re.search(r"location\.href='([^']+)'", onclick_link["onclick"])
                if match:
                    real_apply_url = match.group(1)
                    return real_apply_url

            print(f"No redirect link found in {apply_link}")
            return None
    except Exception as e:
        print(f"Failed to resolve redirect for {apply_link}: {e}")
        return None


def clean_description_html(description_div: BeautifulSoup) -> str:
    if not description_div:
        return ""

    after_content = description_div.find("div", class_="dlpro-banner-aftercontent")
    if after_content:
        for el in list(after_content.find_all_next()):
            el.decompose()
        after_content.decompose()

    for ad_class in AD_CLASSES:
        for ad in description_div.select(f"div.{ad_class}"):
            ad.decompose()

    for tag in description_div(["script", "iframe"]):
        tag.decompose()

    for p in description_div.find_all("p"):
        if not p.get_text(strip=True):
            p.decompose()
        for div in p.find_all("div"):
            div.unwrap()

    return description_div.decode_contents().strip()


async def fetch_apply_page(session: ClientSession, apply_url: str):
    try:
        full_url = urljoin(BASE_URL, apply_url)

        async with session.get(apply_url, headers=HEADERS) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            apply_container = soup.find("ul", class_="gmr-download-list")
            if not apply_container:
                print("No apply links found on: ", full_url)
                return []

            apply_btn_list = apply_container.find_all("li")

            relative_links = [
                {
                    "link": li.find("a").get("href"),
                    "text": re.sub(r"^\d+\.\s*", "", li.find("a").get_text(strip=True))
                }
                for li in apply_btn_list
            ]
            for item in relative_links:
                full_url = urljoin(full_url, item["link"])
                final_url = await fetch_final_redirect(session, full_url)
                item["application_contact_url"] = final_url

            return relative_links

    except Exception as e:
        print(f"Failed to fetch apply page {apply_url}: {e}")
        return None


async def fetch(session: ClientSession, item, semaphore: Semaphore):
    async with semaphore:
        url = item["url"]

        async with session.get(url, headers=HEADERS) as response:
            html = await response.text()

            html = re.sub(r"<tr\"?>", "<tr>", html)
            soup = BeautifulSoup(html, "html.parser")

            company = soup.find("h1", class_="entry-title")
            company_name = company.get_text(strip=True) if company else None

            meta = soup.find("div", class_="entry-meta")
            number_of_vacancies = int(meta.find("span").get_text(strip=True)) if meta else 0

            spec_tables = soup.find_all("table", class_="table-gmr")
            spec_data = {}

            for table in spec_tables:
                for row in table.find_all("tr"):
                    th = row.find("th")
                    tds = row.find_all("td")
                    if not th or not tds:
                        continue

                    key = th.get_text(strip=True).lower()
                    key = re.sub(r"[^a-z0-9]+", "_", key).strip("_")

                    value_td = tds[-1]
                    links = value_td.find_all("a")

                    if key == "tanggal_dipublish":
                        time_tag = value_td.find("time", class_="entry-date published")
                        value = time_tag.get_text(strip=True) if time_tag else value_td.get_text(strip=True)
                    elif links:
                        value = ", ".join(a.get_text(strip=True) for a in links)
                    else:
                        value = value_td.get_text(strip=True)

                    spec_data[key] = value

            desc_div = soup.find("div", id="description")
            description_html = clean_description_html(desc_div)

            apply_button = soup.find("a", class_="button")
            apply_link = apply_button.get("href") if apply_button else None

            position_available = None

            if apply_link and apply_link not in ["#", "apply", ""]:
                try:
                    position_available = await fetch_apply_page(session, apply_link)
                except Exception as e:
                    print(f"Failed to fetch apply page {apply_link}: {e}")
                    position_available = None
            else:
                email, phone = extract_contact_from_paragraphs(desc_div)
                positions = extract_job_sections(desc_div)
                position_available = [
                    {
                        "text": position,
                        "application_contact_email": email,
                        "application_contact_phone": phone
                    }
                    for position in positions
                ]

            return {
                "url": url,
                "company_name": company_name,
                "number_of_vacancies": number_of_vacancies,
                "last_modified": item["last_modified"],
                "image": item["image"],
                "specification": spec_data,
                "description": description_html,
                "position_available": position_available,
            }


async def fetch_with_retry(session: ClientSession, item, semaphore: Semaphore, retries: int = 3):
    for attempt in range(retries):
        try:
            return await fetch(session, item, semaphore)
        except Exception as e:
            if attempt < retries - 1:
                await asyncio.sleep(1 * (2 ** attempt))
            else:
                print(f"Failed {item['url']}: {e}")
                return None
    return None


async def scrape_and_save(session: AsyncSession):
    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    provider_result = await session.execute(select(JobProvider).where(JobProvider.base_url == BASE_URL))
    provider = provider_result.scalar_one_or_none()

    if not provider:
        # create it if not exists
        provider = JobProvider(name="OpenKerja", base_url=BASE_URL)
        session.add(provider)
        await session.commit()
        await session.refresh(provider)

    try:
        provider.is_syncing = True
        await session.commit()

        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as http:
            data = await fetch_sitemap(
                http,
                SITEMAP_INDEX_URL,
                SITEMAP_TARGET,
                provider.last_synced_at
            )
            print(f"Found {len(data)} URLs to scrape...")

            tasks = [fetch_with_retry(http, item, semaphore) for item in data[:100]]
            results = await asyncio.gather(*tasks)

            for result in filter(None, results):
                query = select(JobPosting).where(JobPosting.job_url == result["url"]).options(
                    selectinload(JobPosting.positions), selectinload(JobPosting.specification)
                )
                existing_result = await session.execute(query)
                existing = existing_result.scalar_one_or_none()

                spec_data = result.get("specification") or {}

                spec_instance = Specification(
                    location=spec_data.get("lokasi"),
                    education_level=spec_data.get("pendidikan"),
                    experience_level=spec_data.get("pengalaman"),
                    date_published=spec_data.get("tanggal_dipublish"),
                    job_type=spec_data.get("tipe_pekerjaan"),
                    application_deadline=spec_data.get("batas_lamaran"),
                    major=spec_data.get("jurusan")
                )

                position_data_list = result.get("position_available", [])

                if existing:
                    existing.company_name = result.get("company_name")
                    existing.description = result.get("description")
                    existing.image = result.get("image")
                    existing.last_modified = result.get("last_modified")
                    existing.number_of_vacancies = result.get("number_of_vacancies")
                    existing.job_provider_id = provider.id

                    if existing.specification:
                        for field, value in spec_instance.model_dump(exclude_unset=True).items():
                            setattr(existing.specification, field, value)
                    else:
                        existing.specification = spec_instance

                    existing.positions.clear()
                    existing.positions.extend([Position(**p) for p in position_data_list])

                else:
                    job_posting = JobPosting(
                        job_url=result["url"],
                        company_name=result.get("company_name"),
                        description=result.get("description"),
                        image=result.get("image"),
                        last_modified=result.get("last_modified"),
                        number_of_vacancies=result.get("number_of_vacancies"),
                        job_provider_id=provider.id,
                        specification=spec_instance,
                        positions=[Position(**p) for p in position_data_list]
                    )
                    session.add(job_posting)

                await session.commit()

        provider.is_syncing = False
        provider.last_synced_at = datetime.now(timezone.utc)
        await session.commit()

        print(f"\nSynced {len(results)} job posts from {provider.name}")

    except Exception as e:
        provider.is_syncing = False
        await session.commit()
        print(f"Sync failed for {provider.name}: {e}")


async def main():
    start_time = time.perf_counter()

    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        data = await fetch_sitemap(
            session,
            SITEMAP_INDEX_URL,
            SITEMAP_TARGET,
        )
        print(f"Found {len(data)} URLs to scrape...")

        tasks = [fetch_with_retry(session, item, semaphore) for item in data[:5]]
        results = await asyncio.gather(*tasks)
        results = [r for r in results if r]

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    print(f"\nScraped {len(results)} job posts")
    print(f"Total time cost: {elapsed:.2f} seconds ({elapsed / len(results):.2f}s per post)")
    pprint(results)


if __name__ == "__main__":
    asyncio.run(main())
