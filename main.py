import asyncio
import re
import time
from datetime import datetime
from pprint import pprint
from urllib.parse import urljoin

import aiohttp
from bs4 import BeautifulSoup

BASE_URL = "https://www.openkerja.id"
SITEMAP_URL = "https://www.openkerja.id/post-sitemap2.xml"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; OpenKerjaScraper/1.0; +https://github.com/superiorkid)"}
SEM_LIMIT = 20
AD_CLASSES = {"dlpro-banner-beforecontent", "dlpro-banner-insidecontent"}


def parse_date(date_str):
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00")) if date_str else datetime.min
    except ValueError:
        return datetime.min

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

async def fetch_sitemap(session):
    async with session.get(SITEMAP_URL, headers=HEADERS) as res:
        xml_text = await res.text()
        soup = BeautifulSoup(xml_text, "xml")

        data = []

        for url_tag in soup.find_all("url"):
            loc = url_tag.find("loc").text
            lastmod = url_tag.find("lastmod").text if url_tag.find("lastmod") else None
            image_tag = url_tag.find("image:loc")
            image = image_tag.text if image_tag else None

            data.append({
                "url": loc,
                "last_modified": lastmod,
                "image": image
            })

        data.sort(key=lambda x: parse_date(x["last_modified"]), reverse=True)
        return data

async def fetch_final_redirect(session, apply_link):
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


async def fetch_apply_page(session, apply_url):
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
                final_url = await fetch_final_redirect(session,full_url)
                item["final_url"] = final_url

            return relative_links

    except Exception as e:
        print(f"Failed to fetch apply page {apply_url}: {e}")
        return None


async def fetch(session, item, semaphore):
    async with semaphore:
        url = item["url"]

        async with session.get(url, headers=HEADERS) as response:
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            company = soup.find("h1", class_="entry-title")
            company_name = company.get_text(strip=True) if company else None

            meta = soup.find("div", class_="entry-meta")
            number_of_vacancies = meta.find("span").get_text(strip=True) if meta else None

            spec_tables = soup.find_all("table", class_="table-gmr")
            spec_data = {}
            for table in spec_tables:
                for row in table.find_all("tr"):
                    th = row.find("th")
                    tds = row.find_all("td")
                    if not th or not tds:
                        continue
                    key = th.get_text(strip=True)
                    value_td = tds[-1]
                    links = value_td.find_all("a")

                    if key == "Tanggal Dipublish":
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

async def fetch_with_retry(session, item, semaphore, retries=3):
    for attempt in range(retries):
        try:
            return await fetch(session, item, semaphore)
        except Exception as e:
            if attempt < retries - 1:
                await asyncio.sleep(1 * (2 ** attempt))
            else:
                print(f"Failed {item['url']}: {e}")
                return None

async def main():
    start_time = time.perf_counter()

    timeout = aiohttp.ClientTimeout(total=30)
    connector = aiohttp.TCPConnector(limit=50)
    semaphore = asyncio.Semaphore(SEM_LIMIT)

    async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
        data = await fetch_sitemap(session)
        print(f"Found {len(data)} URLs to scrape...")

        tasks = [fetch_with_retry(session, item, semaphore) for item in data]
        results = await asyncio.gather(*tasks)
        results = [r for r in results if r]

    end_time = time.perf_counter()
    elapsed = end_time - start_time

    print(f"\nScraped {len(results)} job posts")
    print(f"Total time cost: {elapsed:.2f} seconds ({elapsed/len(results):.2f}s per post)")
    pprint(results[0])


if __name__ == "__main__":
    asyncio.run(main())
