import asyncio
import time
from asyncio import Semaphore
from pprint import pprint

import aiohttp
from aiohttp import ClientSession
from bs4 import BeautifulSoup
from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.constants import SEM_LIMIT, HEADERS
from app.models import JobProvider
from app.scraper.service import fetch_sitemap

BASE_URL = "https://www.jakartakerja.com"

SITEMAP_INDEX_URL="https://www.jakartakerja.com/sitemap_index.xml"
SITEMAP_TARGET="lowongan-sitemap"

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

        async with session.get(url, headers=HEADERS) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            container = soup.find("div", id="loker-container")

            company_name = container.find("span", class_="perusahaan").text
            image = container.find("img", class_="attachment-thumb100").get("src")

            # find description
            html_blocks = []
            for h2 in container.find_all("h2"):
                next_span = h2.find_next_sibling("span", class_="loker-detail")
                if next_span:
                    combined_html = str(h2) + str(next_span)
                    html_blocks.append(combined_html)
            description = "\n".join(html_blocks)


            # specification
            specification = {}

            education = container.find("li", class_="pendidikan")
            education_level = (
                education.find_next_sibling("li").text.strip()
                if education and education.find_next_sibling("li")
                else None
            )
            specification["education_level"] = education_level

            experience = container.find("li", class_="pengalaman-kerja")
            experience_level = (
                experience.find_next_sibling("li").text.strip()
                if experience and experience.find_next_sibling("li")
                else None
            )
            specification["experience_level"] = experience_level

            gender = container.find("li", class_="gender")
            gender_value = (
                gender.find_next_sibling("li").text.strip()
                if gender and gender.find_next_sibling("li")
                else None
            )
            specification["gender"] = gender_value

            age = container.find("li", class_="umur")
            age_value = (
                age.find_next_sibling("li").text.strip()
                if age and age.find_next_sibling("li")
                else None
            )
            specification["age"] = age_value

            location = container.find("li", class_="lokasi")
            location_value = (
                location.find_next_sibling("li").text.strip()
                if location and location.find_next_sibling("li")
                else None
            )
            specification["location"] = location_value

            salary = container.find("li", class_="gaji")
            salary_value = (
                salary.find_next_sibling("li").text.strip()
                if salary and salary.find_next_sibling("li")
                else None
            )
            specification["salary"] = salary_value

            email = container.find("li", class_="email")
            application_contact_email = (
                email.find_next_sibling("li").text.strip()
                if email and email.find_next_sibling("li")
                else None
            )
            specification["application_contact_email"] = application_contact_email

            phone = container.find("li", class_="telepon")
            application_contact_phone = (
                phone.find_next_sibling("li").text.strip()
                if phone and phone.find_next_sibling("li")
                else None
            )
            specification["application_contact_phone"] = application_contact_phone

            contact_url = container.find("li", class_="link")
            application_contact_url = (
                contact_url.find("a")["href"].strip()
                if contact_url and contact_url.find("a") and contact_url.find("a").get("href")
                else None
            )
            specification["application_contact_url"] = application_contact_url

            # TODO: complete this

            title = container.find("h1")
            if title:
                text_nodes = title.find_all(string=True)
                position_text = text_nodes[-1].strip() if text_nodes else None
                positions = [p.strip() for p in position_text.split("-")] if position_text else []
            else:
                positions = []

            return {
                "company_name": company_name,
                "job_url": url,
                "image": image,
                "last_modified": item["last_modified"],
                # "description": description,
                "specification": specification,
                "positions": []
            }


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
        # provider.is_syncing = True
        # await session.commit()

        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as http:
            data = await fetch_sitemap(
                http,
                SITEMAP_INDEX_URL,
                SITEMAP_TARGET,
                provider.last_synced_at
            )
            print(f"Found {len(data)} URLs to scrape...")

            tasks = [fetch_with_retry(http, item, semaphore) for item in data[:1]]
            results = await asyncio.gather(*tasks)

            # for result in filter(None, results):
            #     query = select(JobPosting).where(JobPosting.job_url == result["url"])
            #     existing_result = await session.execute(query)
            #     existing = existing_result.scalar_one_or_none()
            #
            #     spec_data = result.get("specification") or {}
            #
            #     spec_instance = Specification(
            #         location=spec_data.get("lokasi"),
            #         education_level=spec_data.get("pendidikan"),
            #         experience_level=spec_data.get("pengalaman"),
            #         date_published=spec_data.get("tanggal_dipublish"),
            #         job_type=spec_data.get("tipe_pekerjaan"),
            #         application_deadline=spec_data.get("batas_lamaran"),
            #         major=spec_data.get("jurusan")
            #     )
            #
            #     position_data_list = result.get("position_available", [])
            #
            #     if existing:
            #         existing.company_name = result.get("company_name")
            #         existing.description = result.get("description")
            #         existing.image = result.get("image")
            #         existing.last_modified = result.get("last_modified")
            #         existing.number_of_vacancies = result.get("number_of_vacancies")
            #         existing.job_provider_id = provider.id
            #
            #         if existing.specification:
            #             for field, value in spec_instance.model_dump(exclude_unset=True).items():
            #                 setattr(existing.specification, field, value)
            #         else:
            #             existing.specification = spec_instance
            #
            #         existing.positions.clear()
            #         existing.positions.extend([Position(**p) for p in position_data_list])
            #
            #     else:
            #         job_posting = JobPosting(
            #             job_url=result["url"],
            #             company_name=result.get("company_name"),
            #             description=result.get("description"),
            #             image=result.get("image"),
            #             last_modified=result.get("last_modified"),
            #             number_of_vacancies=result.get("number_of_vacancies"),
            #             job_provider_id=provider.id,
            #             specification=spec_instance,
            #             positions=[Position(**p) for p in position_data_list]
            #         )
            #         session.add(job_posting)
            #
            #     await session.commit()

        # provider.is_syncing = False
        # provider.last_synced_at = datetime.now(timezone.utc)
        # await session.commit()
        #
        # print(f"\nSynced {len(results)} job posts from {provider.name}")

    except Exception as e:
        # provider.is_syncing = False
        # await session.commit()
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

        tasks = [fetch_with_retry(session, item, semaphore) for item in data[:1]]
        results = await asyncio.gather(*tasks)
        results = [r for r in results if r]

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    print(f"\nScraped {len(results)} job posts")
    print(f"Total time cost: {elapsed:.2f} seconds ({elapsed/len(results):.2f}s per post)")
    pprint(results)


if __name__ == "__main__":
    asyncio.run(main())