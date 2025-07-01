from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.producer.routes import router as producer_router
from services.common.db.database import run_startup_migrations


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: run migrations
    await run_startup_migrations()
    yield
    # Shutdown: clean up resources if needed
    pass


app = FastAPI(
    title="Hedge Lords Producer",
    version="1.0.0",
    description="API for the Hedge Lords Producer",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(producer_router)
