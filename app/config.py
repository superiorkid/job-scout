from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # base
    debug: bool
    project_name: str
    description: str
    database_url: str
