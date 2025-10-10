import asyncio
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.database import get_session
from app.models import OpenKerjaModel
from app.openkerjaid.service import scrape_and_save

openkerjaid_router = APIRouter(tags=["OpenKerja"], prefix="/openkerja")

@openkerjaid_router.get("/")
async def jobs(session: Annotated[AsyncSession, Depends(get_session)]):
    try:
        result = await session.exec(select(OpenKerjaModel))
        jobs_vacancies = result.all()

        return JSONResponse(
            content={
                "success": True,
                "message": "No job vacancies found" if not jobs_vacancies else "Job vacancies retrieved",
                "data": jsonable_encoder(jobs_vacancies),
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