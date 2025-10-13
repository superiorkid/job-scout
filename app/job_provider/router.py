import uuid
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, BackgroundTasks, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette.responses import JSONResponse

from app.database import get_session
from app.job_provider.service import scrape_provider
from app.models import JobProvider

job_provider_router = APIRouter(tags=["job_provider"], prefix="/providers")


@job_provider_router.get("/")
async def list_providers(
        session: Annotated[AsyncSession, Depends(get_session)],
):
    try:
        result = await session.exec(select(JobProvider))
        providers = result.scalars().all()
        return JSONResponse(content={"success": True, "message": "", "data": jsonable_encoder(providers)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@job_provider_router.post("/sync")
async def sync_jobs(
        background_task: BackgroundTasks,
        session: Annotated[AsyncSession, Depends(get_session)],
        provider_name: Optional[str] = Query(description="Provider name (optional)")
):
    if not provider_name:
        raise HTTPException(status_code=400, detail="Provider name is required")

    provider_result = await session.exec(
        select(JobProvider).where(JobProvider.name == provider_name)
    )
    job_provider = provider_result.scalar_one_or_none()

    if not job_provider:
        raise HTTPException(
            status_code=404,
            detail=f"Provider '{provider_name}' not found. Please register or seed it first."
        )

    active_sync_query = await session.exec(
        select(JobProvider).where(JobProvider.is_syncing is True)
    )
    active_provider = active_sync_query.first()
    if active_provider:
        raise HTTPException(
            status_code=409,
            detail=f"Provider '{active_provider.name}' is currently syncing. Please wait until the sync process completes before proceeding."
        )

    background_task.add_task(scrape_provider, provider_name, session)
    return JSONResponse(
        content={
            "success": True,
            "message": f"Scraping started for {provider_name}"
        }
    )


@job_provider_router.get("/active-sync")
async def active_sync(
        session: Annotated[AsyncSession, Depends(get_session)],
        provider_id: Annotated[Optional[uuid.UUID], Query(description="Provider id (optional)")],
):
    try:
        if provider_id:
            query = select(JobProvider).where(JobProvider.id == provider_id)
            result = await session.exec(query)
            provider = result.scalar_one_or_none()

            if not provider:
                raise HTTPException(status_code=404, detail=f"Provider '{provider_id}' not found.")

            return JSONResponse(
                content={
                    "success": True,
                    "data": jsonable_encoder(provider),
                    "message": f"Provider '{provider_id}' is currently syncing."
                },
                status_code=200
            )

        active_sync_query = await session.exec(
            select(JobProvider).where(JobProvider.is_syncing is True)
        )
        active_providers = active_sync_query.scalars().all()

        return JSONResponse(
            content={
                "success": True,
                "data": jsonable_encoder(active_providers),
                "message": "No providers are currently syncing" if not active_providers else "Active syncing providers retrivied successfully."
            },
            status_code=200
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e

        raise HTTPException(status_code=500, detail=str(e))


@job_provider_router.get("/{provider_id}")
async def detail_provider(
        provider_id: Annotated[uuid.UUID, Path(title="ProviderID")],
        session: Annotated[AsyncSession, Depends(get_session)],
):
    try:
        query = select(JobProvider).where(JobProvider.id == provider_id)
        result = await session.exec(query)
        provider = result.scalars().first()

        if not provider:
            raise HTTPException(status_code=404, detail="Provider not found")

        return JSONResponse(content=jsonable_encoder(provider), status_code=200)
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e

        raise HTTPException(status_code=500, detail=str(e))
