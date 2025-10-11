from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession
from starlette.responses import JSONResponse

from app.database import get_session
from app.models import JobProvider

job_provider_router = APIRouter(tags=["job_provider"], prefix="/providers")

@job_provider_router.get("/")
async def list_providers(
    session: Annotated[AsyncSession, Depends(get_session)],
):
  try:
      result = await session.exec(select(JobProvider))
      providers = result.scalars().all()
      return JSONResponse(content={"success": True, "message": "" , "data": jsonable_encoder(providers)})
  except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
