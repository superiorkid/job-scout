import asyncio
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio.session import AsyncSession

from app.database import engine
from app.models import JobProvider

PROVIDERS = [
    {"name": "OpenKerja", "base_url": "https://www.openkerja.id"},
    {"name": "JakartaKerja", "base_url": "https://www.jakartakerja.com"},
]

async def seed_providers():
    async with AsyncSession(engine) as session:
        for p in PROVIDERS:
            result = await session.execute(
                select(JobProvider).where(JobProvider.base_url == p["base_url"])
            )
            existing = result.scalar_one_or_none()

            if not existing:
                session.add(JobProvider(id=uuid.uuid4(), **p))

        await session.commit()

    print("✅ Providers seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_providers())