from typing import Optional, List, Dict

from sqlalchemy import JSON
from sqlmodel import SQLModel, Field, Column


class PositionBase(SQLModel):
    text: str
    application_contact_url: Optional[str] = None
    application_contact_email: Optional[str] = None
    application_contact_phone: Optional[str] = None
    salary: Optional[str] = None


class SpecificationBase(SQLModel):
    application_deadline: Optional[str] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    experience_level: Optional[str] = None
    date_published: Optional[str] = None
    job_type: Optional[str] = None
    work_arrangement: Optional[str]
    industry: Optional[str] = None
    gender: Optional[str] = None


class JobPostingBase(SQLModel):
    job_url: str = Field(index=True)
    company_name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    image: Optional[str] = Field(default=None)
    last_modified: Optional[str] = Field(default=None)
    number_of_vacancies: Optional[int] = Field(default=None)