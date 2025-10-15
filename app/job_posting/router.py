import uuid
from enum import Enum
from math import ceil
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.job_provider.schema import JobPostingRead
from app.models import JobPosting, JobProvider

jobs_posting_router = APIRouter(tags=["job_posting"], prefix="/jobs")


class ProviderEnum(str, Enum):
    AllJobs = "AllJobs"
    JakartaKerja = "JakartaKerja"
    OpenKerja = "OpenKerja"


@jobs_posting_router.get("/", response_model=dict)
async def jobs(
        session: Annotated[AsyncSession, Depends(get_session)],
        provider_id: Optional[uuid.UUID] = Query(None),
        limit: Annotated[int, Query(gt=0, le=100)] = 15,
        page: Annotated[int, Query(gt=0)] = 1,
        provider: Annotated[ProviderEnum, Query()] = ProviderEnum.AllJobs,
):
    try:
        offset = (page - 1) * limit

        statement = (
            select(JobPosting)
            .options(
                selectinload(JobPosting.provider),
                selectinload(JobPosting.positions),
                selectinload(JobPosting.specification),
            )
            .order_by(JobPosting.last_modified.desc())
        )

        if provider != ProviderEnum.AllJobs:
            statement = statement.join(JobPosting.provider).where(JobProvider.name == provider)

        if provider_id:
            statement = statement.where(JobPosting.job_provider_id == provider_id)

        total_statement = select(func.count()).select_from(statement.subquery())
        total_count = (await session.exec(total_statement)).scalar_one()

        result = await session.exec(statement.limit(limit).offset(offset))
        jobs_vacancies = result.unique().scalars().all()

        total_pages = ceil(total_count / limit) if total_count else 1

        return {
            "success": True,
            "message": "Job vacancies retrieved" if jobs_vacancies else "No job vacancies found",
            "data": [JobPostingRead.model_validate(job, from_attributes=True) for job in jobs_vacancies],
            "pagination": {
                "total_data": total_count,
                "total_pages": total_pages,
                "current_page": page,
                "limit": limit,
                "has_next": page < total_pages,
                "has_prev": page > 1,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@jobs_posting_router.get("/total")
async def total_jobs(
        session: Annotated[AsyncSession, Depends(get_session)],
):
    query = select(func.count()).select_from(JobPosting)
    total = (await session.exec(query)).scalar_one()

    return {
        "success": True,
        "message": "",
        "data": {
            "total": total,
        }
    }


@jobs_posting_router.get("/{job_id}")
async def detail_job(
        job_id: Annotated[uuid.UUID, Path(title="The job id")],
        session: Annotated[AsyncSession, Depends(get_session)],
):
    try:
        query = select(JobPosting).where(JobPosting.id == job_id)
        result = await session.exec(query)
        job = result.scalars().first()

        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

        return JSONResponse(content={
            "success": True,
            "message": "Job found",
            "data": jsonable_encoder(job),
        }, status_code=200)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e

        raise HTTPException(status_code=500, detail=str(e))
