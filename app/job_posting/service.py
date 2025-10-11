from sqlalchemy.ext.asyncio import AsyncSession

async def scrape_provider(provider_name: str, session: AsyncSession):
    if provider_name == "OpenKerja":
        from app.scraper.openkerjaid import scrape_and_save
        await scrape_and_save(session)