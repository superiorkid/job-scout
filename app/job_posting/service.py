import asyncio
from pprint import pprint

import aiohttp
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.job_posting.scraper.openkerjaid import fetch_sitemap, fetch_with_retry
from app.models import JobPosting, Specification, Position

SEM_LIMIT = 20


async def scrape_and_save(session: AsyncSession):
    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as http:
        data = await fetch_sitemap(http)
        print(f"Found {len(data)} URLs to scrape...")

        tasks = [fetch_with_retry(http, item, semaphore) for item in data[:10]]
        results = await asyncio.gather(*tasks)

        for result in filter(None, results):
            query = select(JobPosting).where(JobPosting.job_url == result["url"])
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
            )

            position_data_list = result.get("position_available", [])

            if existing:
                existing.company_name = result.get("company_name")
                existing.description = result.get("description")
                existing.image = result.get("image")
                existing.last_modified = result.get("last_modified")
                existing.number_of_vacancies = result.get("number_of_vacancies")

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
                    specification=spec_instance,
                    positions=[Position(**p) for p in position_data_list]
                )
                session.add(job_posting)

            await session.commit()


    print(f"\nScraped {len(results)} job posts")
    pprint(results[0])
