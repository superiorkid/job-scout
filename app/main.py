from fastapi import FastAPI
app = FastAPI(description="Job Scout API")


@app.get("/")
async def root():
    return {"message": "Hello World"}
