from fastapi import FastAPI

from app import settings

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await init_db()
#     yield
#     print("Cleaning up resources...")

app = FastAPI(
    title=settings.project_name,
    debug=settings.debug,
    description=settings.description,
    # lifespan=lifespan,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

