from fastapi import FastAPI

from app import settings
from app.job_posting.router import openkerjaid_router

app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
    description=settings.description,
)

app.include_router(
    openkerjaid_router,
    prefix=settings.api_prefix
)