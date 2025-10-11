from typing import Optional

from sqlmodel import SQLModel, Field


class JobProviderBase(SQLModel):
    name: str
    base_url: str = Field(index=True, unique=True)
    description: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)