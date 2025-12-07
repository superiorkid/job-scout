import asyncio
import atexit

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import settings
from app.job_posting.router import jobs_posting_router
from app.job_provider.router import job_provider_router
from app.job_provider.service import scrape_provider


async def scheduled_scraper(provider_name: str):
    from app.database import get_session
    async with get_session() as session:
        await scrape_provider(provider_name, session)


scheduler = BackgroundScheduler()

scheduler.add_job(
    lambda: asyncio.run(scheduled_scraper("JakartaKerja")),
    CronTrigger(hour=0, minute=0),
    id="jakartakerja_scraper",
    replace_existing=True,
)

scheduler.add_job(
    lambda: asyncio.run(scheduled_scraper("OpenKerja")),
    CronTrigger(hour=3, minute=0),
    id="openkerja_scraper",
    replace_existing=True,
)

scheduler.start()


@atexit.register
def shutdown():
    print("Shutting down scheduler...")
    scheduler.shutdown()


app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
    description=settings.description,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    job_provider_router,
    prefix=settings.api_prefix
)
app.include_router(
    jobs_posting_router,
    prefix=settings.api_prefix
)


@app.get("/")
def index():
    return {"test": "ok"}
