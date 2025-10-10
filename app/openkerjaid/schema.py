from typing import Optional, List

from sqlalchemy import JSON
from sqlmodel import SQLModel, Field, Column


class Position(SQLModel):
    text: str
    link: Optional[str] = None
    final_url: Optional[str] = None


class Specification(SQLModel):
    batas_lamaran: Optional[str] = None
    link: Optional[str] = None
    lokasi: Optional[str] = None
    pendidikan: Optional[str] = None
    pengalaman: Optional[str] = None
    tanggal_dipublish: Optional[str] = None
    tipe_pekerjaan: Optional[str] = None


class OpenKerjaBase(SQLModel):
    company_name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    image: Optional[str] = Field(default=None)
    last_modified: Optional[str] = Field(default=None)
    number_of_vacancies: Optional[int] = Field(default=0)
    url: str = Field(index=True)

    position_available: Optional[List[Position]] = Field(
        default=None, sa_column=Column(JSON)
    )
    specification: Optional[List[Specification]] = Field(
        default=None, sa_column=Column(JSON)
    )

