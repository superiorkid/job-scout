import uuid
from math import ceil
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlmodel import func
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.job_posting.service import scrape_provider
from app.models import JobPosting

jobs_posting_router = APIRouter(tags=["job_posting"], prefix="/jobs")

@jobs_posting_router.get("/")
async def jobs(
    session: Annotated[AsyncSession, Depends(get_session)],
    provider_id: Optional[uuid.UUID] = Query(None),
    limit: Annotated[int, Query(gt=0, lt=100)] = 15,
    page: Annotated[int, Query(gt=0)] = 1,
):
    try:
        offset = (page - 1) * limit

        statement = select(JobPosting)
        if provider_id:
            statement = statement.where(JobPosting.job_provider_id == provider_id)

        total_statement  = select(func.count()).select_from(statement.subquery())
        total_count = (await session.exec(total_statement)).scalar_one()

        query = statement.limit(limit).offset(offset)
        jobs_vacancies = (await session.exec(query)).scalars().all()

        total_pages = ceil(total_count / limit) if total_count else 1

        return JSONResponse(
            content={
                "success": True,
                "message": (
                    "No job vacancies found"
                    if not jobs_vacancies
                    else "Job vacancies retrieved"
                ),
                "data": jsonable_encoder(jobs_vacancies),
                "pagination": {
                    "total_data": total_count,
                    "total_pages": total_pages,
                    "current_page": page,
                    "limit": limit,
                    "has_next": page < total_pages,
                    "has_prev": page > 1,
                },
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@jobs_posting_router.post("/sync")
async def sync_jobs(
    background_task: BackgroundTasks,
    session: Annotated[AsyncSession, Depends(get_session)],
    provider: Optional[str] = Query(description="Provider name (optional)")
):
    if not provider:
        raise HTTPException(status_code=400, detail="Provider name is required")

    background_task.add_task(scrape_provider, provider, session)
    return JSONResponse(
        content={
            "success": True,
            "message": f"Scraping started for {provider}"
        }
    )