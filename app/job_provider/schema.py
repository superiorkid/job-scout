import uuid
from datetime import datetime
from typing import Optional, List

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


class PositionRead(SQLModel):
    id: uuid.UUID
    text: str
    salary: Optional[str]
    application_contact_url: Optional[str]
    application_contact_email: Optional[str]
    application_contact_phone: Optional[str]


class SpecificationRead(SQLModel):
    id: uuid.UUID
    application_deadline: Optional[str]
    location: Optional[str]
    education_level: Optional[str]
    major: Optional[str]
    experience_level: Optional[str]
    date_published: Optional[str]
    job_type: Optional[str]
    work_arrangement: Optional[str]
    industry: Optional[str]
    gender: Optional[str]
    age: Optional[str]


class ProviderRead(SQLModel):
    id: uuid.UUID
    name: str
    base_url: str
    description: Optional[str]


class JobPostingRead(SQLModel):
    id: uuid.UUID
    company_name: Optional[str]
    description: Optional[str]
    image: Optional[str]
    last_modified: Optional[str]
    number_of_vacancies: Optional[int]

    provider: Optional[ProviderRead]
    specification: Optional[SpecificationRead]
    positions: List[PositionRead] = []
