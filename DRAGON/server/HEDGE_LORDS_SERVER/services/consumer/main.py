import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.consumer.routes import router as consumer_router
from services.consumer.routes import router as auth_router
from services.consumer.service import consumer
from services.consumer.payoff_service import payoff_consumer
from services.common.core.logging import consumer_logger as logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: run migrations and start polling
    logger.info("CONSUMER: Application starting")

    # Create background tasks instead of awaiting directly
    consumer_task = asyncio.create_task(consumer.start_polling())
    payoff_task = asyncio.create_task(payoff_consumer.start_polling())

    yield

    # Shutdown: stop polling gracefully
    logger.info("CONSUMER: Application shutting down")
    consumer.should_stop = True
    payoff_consumer.should_stop = True

    # Wait for polling tasks to stop
    polling_task = asyncio.create_task(consumer.stop_polling())
    payoff_polling_task = asyncio.create_task(payoff_consumer.stop_polling())

    # Wait for both tasks with a timeout
    try:
        # Cancel the running polling tasks
        consumer_task.cancel()
        payoff_task.cancel()

        await asyncio.wait_for(
            asyncio.gather(polling_task, payoff_polling_task), timeout=5.0
        )
        logger.info("CONSUMER: Polling tasks stopped successfully")
    except asyncio.TimeoutError:
        logger.warning("CONSUMER: Timeout waiting for polling tasks to stop")
    except Exception as e:
        logger.error(f"CONSUMER: Error stopping polling tasks: {e}")


app = FastAPI(
    title="Hedge Lords Consumer",
    version="1.0.0",
    description="API for the Hedge Lords Consumer",
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

app.include_router(auth_router)
app.include_router(consumer_router)

# if __name__ == "__main__":
#     import uvicorn

#     uvicorn.run(app, host="0.0.0.0", port=9501)
