import uuid
from datetime import datetime, timezone
from typing import Optional, List

from sqlalchemy import DateTime
from sqlmodel import Field, Column, Relationship

from app.job_posting.schema import JobPostingBase, SpecificationBase, PositionBase

class Specification(SpecificationBase, table=True):
    __tablename__ = "specifications"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    job_posting_id: Optional[uuid.UUID] = Field(
        default=None,
        foreign_key="job_postings.id",
        ondelete="CASCADE"
    )
    job_posting: Optional["JobPosting"] = Relationship(back_populates="specification")


class Position(PositionBase, table=True):
    __tablename__ = "positions"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    job_posting_id: Optional[uuid.UUID] = Field(
        default=None,
        foreign_key="job_postings.id",
        ondelete="CASCADE"
    )
    job_posting: Optional["JobPosting"] = Relationship(back_populates="positions")


class JobPosting(JobPostingBase, table=True):
    __tablename__ = "job_postings"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    positions: List[Position] = Relationship(back_populates="job_posting")
    specification: Optional[Specification] = Relationship(back_populates="job_posting")

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            onupdate=datetime.now(timezone.utc),
        ),
    )