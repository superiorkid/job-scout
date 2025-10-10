import asyncio
from pprint import pprint

import aiohttp
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import OpenKerjaModel
from app.openkerjaid.scraper import fetch_sitemap, fetch_with_retry

SEM_LIMIT = 20

async def scrape_and_save(session: AsyncSession):
    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as http:
        data = await fetch_sitemap(http)
        print(f"Found {len(data)} URLs to scrape...")

        tasks = [fetch_with_retry(http, item, semaphore) for item in data]
        results = await asyncio.gather(*tasks)

        for result in filter(None, results):
            query = select(OpenKerjaModel).where(OpenKerjaModel.url == result["url"])
            existing_result = await session.exec(query)
            existing = existing_result.first()

            if existing:
                for key, value in result.items():
                    setattr(existing, key, value)
            else:
                session.add(OpenKerjaModel(**result))

        await session.commit()

    print(f"\nScraped {len(results)} job posts")
    pprint(results[0])