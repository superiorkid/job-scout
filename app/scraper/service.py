import asyncio
from urllib.parse import urlparse

from aiohttp import ClientSession
from bs4 import BeautifulSoup

from app.constants import HEADERS
from app.utils.parse_date import parse_date


async def fetch_xml(session: ClientSession, url: str) -> str:
    async with session.get(url, headers=HEADERS) as res:
        return await res.text()

async def parse_sitemap(session: ClientSession, sitemap_url: str):
    xml_text = await fetch_xml(session, sitemap_url)
    soup = BeautifulSoup(xml_text, "xml")

    items = []
    for url_tag in soup.find_all("url"):
        loc = url_tag.find("loc")
        lastmod = url_tag.find("lastmod")
        image_tag = url_tag.find("image:loc")

        if not loc:
            continue

        items.append({
            "url": loc.text.strip(),
            "last_modified": lastmod.text.strip() if lastmod else None,
            "image": image_tag.text.strip() if image_tag else None,
        })

    return items

async def fetch_sitemap(session: ClientSession, sitemap_index_url: str, sitemap_target: str):
    xml_text = await fetch_xml(session, sitemap_index_url)
    soup = BeautifulSoup(xml_text, "xml")

    # Filter only post-sitemap*.xml
    sitemap_urls = [
        sitemap.find("loc").text.strip()
        for sitemap in soup.find_all("sitemap")
        if sitemap.find("loc") and sitemap_target in sitemap.find("loc").text
    ]

    print(f"Found {len(sitemap_urls)} post sitemaps")

    tasks = [parse_sitemap(session, url) for url in sitemap_urls]
    results = await asyncio.gather(*tasks)

    parsed_url = urlparse(sitemap_index_url)
    base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"

    all_items = [
        item for sublist in results
        for item in sublist
        if item["url"].startswith(base_url)
    ]
    all_items.sort(key=lambda x: parse_date(x["last_modified"]), reverse=True)

    return all_items