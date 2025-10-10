from math import ceil
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlmodel import func
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.models import JobPosting
from app.job_posting.service import scrape_and_save

openkerjaid_router = APIRouter(tags=["OpenKerja"], prefix="/openkerja")

@openkerjaid_router.get("/")
async def jobs(
    session: Annotated[AsyncSession, Depends(get_session)],
    limit: Annotated[int, Query(gt=0, lt=100)] = 15,
    page: Annotated[int, Query(gt=0)] = 1,
):
    try:
        offset = (page - 1) * limit

        total_stmt = select(func.count()).select_from(JobPosting)
        total_result = await session.exec(total_stmt)
        total_count = total_result.scalar_one()

        query = select(JobPosting).limit(limit).offset(offset).options(
            selectinload(JobPosting.positions), selectinload(JobPosting.specification)
        )
        result = await session.exec(query)
        jobs_vacancies = result.scalars().all()

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


@openkerjaid_router.post("/sync")
async def sync_jobs(
    background_task: BackgroundTasks,
    session: Annotated[AsyncSession, Depends(get_session)]
):
    background_task.add_task(scrape_and_save, session)
    return JSONResponse(
        content={
            "success": True,
            "message": "Scraping started in background",
        }
    )