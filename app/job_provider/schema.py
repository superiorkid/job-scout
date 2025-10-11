from datetime import datetime
from typing import Optional

from sqlalchemy import Column, Boolean, DateTime
from sqlmodel import SQLModel, Field


class JobProviderBase(SQLModel):
    name: str
    base_url: str = Field(index=True, unique=True)
    description: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True, sa_column=Column(Boolean, nullable=False))
    is_syncing: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    last_synced_at: Optional[datetime] = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True)
    )