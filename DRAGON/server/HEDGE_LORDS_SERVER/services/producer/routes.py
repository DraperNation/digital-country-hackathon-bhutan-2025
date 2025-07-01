from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from services.common.db.database import db_session
from services.common.core.config import EXCHANGES
from services.common.types.models import SubscriptionRequest, LoadOHLCVRequest
from services.producer.service import OptionsProducer

router = APIRouter(prefix="/producer", tags=["producer"])

# This needs to be added to the main FastAPI app, not the router
# We'll need to modify the main.py file where the FastAPI app is created

producer = OptionsProducer(
    api_key=EXCHANGES["delta_exchange"]["api_key"],
    api_secret=EXCHANGES["delta_exchange"]["api_secret"],
    ws_url=EXCHANGES["delta_exchange"]["ws_url"],
    api_url=EXCHANGES["delta_exchange"]["base_url"],
)


@router.post("/subscribe")
async def subscribe_symbol(
    request: SubscriptionRequest, db: AsyncSession = Depends(db_session)
):
    await producer.start_streaming(request.symbol, request.expiry_date)
    return {"message": "Subscription started"}


@router.post("/unsubscribe")
async def unsubscribe():
    await producer.stop_streaming()
    return {"message": "Subscription stopped"}


@router.post("/load_ohlcv_data")
async def load_data(request: LoadOHLCVRequest, db: AsyncSession = Depends(db_session)):
    await producer.load_ohlcv_data(
        request.symbol, request.resolution, request.lookback_units, db
    )
    return {"message": "Data loading started"}
