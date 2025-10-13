import asyncio
import time
from asyncio import Semaphore
from datetime import datetime, timezone
from pprint import pprint

import aiohttp
from aiohttp import ClientSession
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import selectinload

from app.constants import SEM_LIMIT, HEADERS
from app.models import JobProvider, JobPosting, Specification, Position
from app.scraper.service import fetch_sitemap, decode_cf_email

BASE_URL = "https://www.jakartakerja.com"

SITEMAP_INDEX_URL = "https://www.jakartakerja.com/sitemap_index.xml"
SITEMAP_TARGET = "lowongan-sitemap"


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


async def fetch(session: ClientSession, item, semaphore: Semaphore):
    async with semaphore:
        url = item["url"]

        try:
            async with session.get(url, headers=HEADERS) as response:
                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")

                container = soup.find("div", id="loker-container")
                if not container:
                    print(f"No container found for {url}")
                    return None

                company_name = None
                image = None
                if container.find("span", class_="perusahaan"):
                    company_name = container.find("span", class_="perusahaan").get_text(strip=True)
                if container.find("img", class_="attachment-thumb100"):
                    image = container.find("img", class_="attachment-thumb100").get("src")

                html_blocks = []
                for h2 in container.find_all("h2"):
                    next_span = h2.find_next_sibling("span", class_="loker-detail")
                    if next_span:
                        html_blocks.append(str(h2) + str(next_span))
                description = "\n".join(html_blocks) if html_blocks else None

                # Specification
                specification = {}

                specification["education_level"] = next_li_text(container, "pendidikan")
                specification["experience_level"] = next_li_text(container, "pengalaman-kerja")
                specification["gender"] = next_li_text(container, "gender")
                specification["age"] = next_li_text(container, "umur")
                specification["location"] = next_li_text(container, "lokasi")
                specification["application_deadline"] = next_li_text(container, "batas-lamaran")

                salary = container.find("li", class_="gaji")
                salary_value = (
                    safe_text(salary.find_next_sibling("li"))
                    if salary and salary.find_next_sibling("li")
                    else None
                )

                email_address = None
                lamar = container.find("div", id="lamar-float")
                if lamar:
                    email_tag = lamar.find("li", class_="email")
                    if email_tag and email_tag.find("a"):
                        email_href = email_tag.find("a").get("href", "")
                        if email_href.startswith("/cdn-cgi/l/email-protection#"):
                            clean_email = decode_cf_email(email_href)
                            email_address = clean_email.split("?")[0].strip()
                        elif email_href.startswith("mailto:"):
                            email_address = email_href.split("mailto:")[1].split("?")[0]

                phone = container.find("li", class_="telepon")
                application_contact_phone = (
                    safe_text(phone.find_next_sibling("li"))
                    if phone and phone.find_next_sibling("li")
                    else None
                )

                contact_url = container.find("li", class_="link")
                application_contact_url = (
                    contact_url.find("a")["href"].strip()
                    if contact_url and contact_url.find("a") and contact_url.find("a").get("href")
                    else None
                )

                positions = []
                title = container.find("h1")
                if title:
                    text_nodes = title.find_all(string=True)
                    position_text = text_nodes[-1].strip() if text_nodes else ""
                    positions = [p.strip() for p in position_text.split("-") if p.strip()]

                position_available = [
                    {
                        "text": p,
                        "application_contact_url": application_contact_url,
                        "application_contact_phone": application_contact_phone,
                        "application_contact_email": email_address,
                        "salary": salary_value,
                    }
                    for p in positions
                ]

                return {
                    "company_name": company_name,
                    "number_of_vacancies": len(position_available),
                    "job_url": url,
                    "image": image,
                    "last_modified": item.get("last_modified"),
                    "description": description,
                    "specification": specification,
                    "positions": position_available,
                }

        except Exception as e:
            print(f"Failed {url}: {e}")
            return None


async def scrape_and_save(session: AsyncSession):
    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    provider_result = await session.execute(select(JobProvider).where(JobProvider.base_url == BASE_URL))
    provider = provider_result.scalar_one_or_none()

    if not provider:
        # create it if not exists
        provider = JobProvider(name="JakartaKerja", base_url=BASE_URL)
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

            tasks = [fetch_with_retry(http, item, semaphore) for item in data[:50]]
            results = await asyncio.gather(*tasks)

            for result in filter(None, results):
                query = select(JobPosting).where(JobPosting.job_url == result["job_url"]).options(
                    selectinload(JobPosting.positions), selectinload(JobPosting.specification)
                )
                existing_result = await session.execute(query)
                existing = existing_result.scalar_one_or_none()

                spec_data = result.get("specification") or {}

                spec_instance = Specification(
                    location=spec_data.get("location"),
                    education_level=spec_data.get("education_level"),
                    experience_level=spec_data.get("experience_level"),
                    application_deadline=spec_data.get("application_deadline"),
                    age=spec_data.get("age"),
                    gender=spec_data.get("gender")
                )

                position_data_list = result.get("positions", [])

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
                        job_url=result["job_url"],
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


def safe_text(element):
    return element.get_text(strip=True) if element else None


def next_li_text(container: BeautifulSoup, selector: str):
    el = container.find("li", class_=selector)
    return safe_text(el.find_next_sibling("li")) if el and el.find_next_sibling("li") else None


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

        tasks = [fetch_with_retry(session, item, semaphore) for item in data[:15]]
        results = await asyncio.gather(*tasks)
        results = [r for r in results if r]

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    print(f"\nScraped {len(results)} job posts")
    print(f"Total time cost: {elapsed:.2f} seconds ({elapsed / len(results):.2f}s per post)")
    pprint(results)


if __name__ == "__main__":
    asyncio.run(main())
