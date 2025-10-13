from fastapi import FastAPI

from app import settings
from app.job_posting.router import jobs_posting_router
from app.job_provider.router import job_provider_router

app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
    description=settings.description,
)



app.include_router(
    job_provider_router,
    prefix=settings.api_prefix
)
app.include_router(
    jobs_posting_router,
    prefix=settings.api_prefix
)
