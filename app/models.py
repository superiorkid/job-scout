import uuid
from datetime import datetime, timezone
from typing import Optional, List

from sqlalchemy import DateTime
from sqlmodel import Field, Column, Relationship

from app.job_posting.schema import JobPostingBase, SpecificationBase, PositionBase
from app.job_provider.schema import JobProviderBase

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


class JobProvider(JobProviderBase, table=True):
    __tablename__ = "job_providers"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    job_postings: List["JobPosting"] = Relationship(back_populates="provider")

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


class JobPosting(JobPostingBase, table=True):
    __tablename__ = "job_postings"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    job_provider_id: uuid.UUID = Field(
        foreign_key="job_providers.id",
        ondelete="CASCADE",
        nullable=False
    )
    provider: JobProvider = Relationship(back_populates="job_postings")

    positions: List[Position] = Relationship(back_populates="job_posting")
    specification: Optional[Specification] = Relationship(
        back_populates="job_posting",
        sa_relationship_kwargs={"uselist": False}
    )

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

