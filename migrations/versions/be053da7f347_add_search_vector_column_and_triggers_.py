"""add search_vector column and triggers for full text search

Revision ID: be053da7f347
Revises: e5767734d5db
Create Date: 2025-10-15 12:53:40.619908

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'be053da7f347'
down_revision: Union[str, Sequence[str], None] = 'e5767734d5db'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1️⃣ Add the new tsvector column
    op.execute("ALTER TABLE job_postings ADD COLUMN search_vector tsvector")

    # 2️⃣ Create the GIN index
    op.execute("CREATE INDEX job_postings_search_idx ON job_postings USING GIN (search_vector)")

    # 3️⃣ Populate the column with initial data
    op.execute("""
               UPDATE job_postings
               SET search_vector =
                       to_tsvector('english',
                                   coalesce(company_name, '') || ' ' ||
                                   coalesce(description, '') || ' ' ||
                                   coalesce(image, '')
                       )
               """)

    # 4️⃣ Create trigger to auto-update the vector
    op.execute("""
               CREATE FUNCTION job_postings_tsvector_trigger() RETURNS trigger AS $$
               begin
      new.search_vector
               :=
         to_tsvector('english', 
            coalesce(new.company_name, '') || ' ' || 
            coalesce(new.description, '') || ' ' ||
            coalesce(new.image, '')
         );
               return new;
               end
    $$
               LANGUAGE plpgsql;
               """)

    op.execute("""
               CREATE TRIGGER tsvectorupdate
                   BEFORE INSERT OR
               UPDATE
                   ON job_postings FOR EACH ROW EXECUTE FUNCTION job_postings_tsvector_trigger();
               """)


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS tsvectorupdate ON job_postings")
    op.execute("DROP FUNCTION IF EXISTS job_postings_tsvector_trigger")
    op.execute("DROP INDEX IF EXISTS job_postings_search_idx")
    op.execute("ALTER TABLE job_postings DROP COLUMN search_vector")
