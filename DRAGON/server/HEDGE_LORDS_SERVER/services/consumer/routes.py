import math
import json
import numpy as np

from fastapi import APIRouter, WebSocket, Depends, HTTPException, Body
from fastapi.responses import JSONResponse
from services.consumer.websocket_manager import manager
from services.common.core.logging import consumer_logger as logger
from services.consumer.payoff_service import payoff_consumer
from services.common.types.models import SimulateRequest
from services.common.db.database import db_session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

router = APIRouter(prefix="/stream", tags=["stream"])


@router.websocket("/options")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, "premiums")
    logger.info("CONSUMER: WebSocket client connected for premiums")

    try:
        # Keep connection alive
        while True:
            try:
                await websocket.receive_text()
            except Exception:
                break
    finally:
        await manager.disconnect("premiums")
        logger.info("CONSUMER: WebSocket client disconnected from premiums")


@router.websocket("/trading")
async def trading_websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket, "trading")
    logger.info("CONSUMER: WebSocket client connected for trading/payoff")

    try:
        # Keep connection alive and process messages from client
        while True:
            try:
                # Receive a message from the client
                message = await websocket.receive_text()

                # Process the message using the payoff consumer
                response = await payoff_consumer.process_message(message)

                # If there's a response, send it back to the client
                if response:
                    await websocket.send_json(response)

            except Exception as e:
                logger.error(
                    f"CONSUMER: Error in trading websocket: {e}", stack_info=True
                )
                break
    finally:
        await manager.disconnect("trading")
        logger.info("CONSUMER: WebSocket client disconnected from trading")


@router.post("/simulate")
async def simulate_monte(request: SimulateRequest):
    try:
        await payoff_consumer.get_monte_carlo(
            request.symbol, request.expiry_date, request.resolution, request.iterations
        )
        return JSONResponse(status_code=200, content="Started simulation")
    except Exception as e:
        logger.error(f"CONSUMER: Error during simulation: {e}", stack_info=True)
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})


@router.delete("/clear_simulations")
def clear_simulations():
    try:
        payoff_consumer.clear_simulations()
    except Exception as e:
        logger.error(f"CONSUMER: Error clearing simulations: {e}", stack_info=True)
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})


@router.post(
    "/expected_values", response_model=Optional[dict[str, dict[str, float]]]
)  # Hint expected success response
async def expected_values(
    request: SimulateRequest, db: AsyncSession = Depends(db_session)
):
    """
    Calculates and returns expected payoff statistics based on Monte Carlo simulation.
    Handles different return scenarios from the calculation service.
    """
    try:
        # Call the function (without modification as requested)
        response = await payoff_consumer.get_expected_values(
            request.symbol,
            request.expiry_date,
            request.resolution,
            db,
            request.iterations,
        )

        # --- Process the response ---

        # Case 1: Success - returned a dictionary with float values
        if isinstance(response, dict):
            # The dictionary should contain standard floats already.
            # We can return it directly; FastAPI handles dict -> JSON.
            logger.info(
                f"Successfully calculated expected values for {request.symbol}, {request.expiry_date}."
            )
            return response

        # Case 2: Returned np.nan (likely no contracts selected)
        # np.nan is a float, so check type and value
        elif isinstance(response, float) and math.isnan(response):
            logger.warning(
                f"Calculation returned NaN for {request.symbol}, {request.expiry_date} (likely no contracts selected or invalid input)."
            )
            # Return 404 Not Found - indicates resource/data wasn't available for calculation
            raise HTTPException(
                status_code=404,
                detail="No contracts selected or insufficient data to calculate expected value.",
            )

        # Case 3: Returned np.ndarray (internal error during calculation)
        elif isinstance(response, np.ndarray):
            # This indicates an error occurred within get_expected_values before
            # the final dictionary was created.
            logger.error(
                f"Internal error in get_expected_values for {request.symbol}, {request.expiry_date} (returned ndarray)."
            )
            raise HTTPException(
                status_code=500,
                detail="Internal error during expected value calculation.",
            )

        # Case 4: Handle any other unexpected return types
        else:
            logger.error(
                f"get_expected_values returned unexpected type: {type(response)} for {request.symbol}, {request.expiry_date}"
            )
            raise HTTPException(
                status_code=500,
                detail=f"Internal error: Unexpected response type {type(response).__name__}",
            )

    except HTTPException as http_exc:
        # Re-raise HTTPExceptions that we raised intentionally above
        raise http_exc
    except ValueError as ve:
        # Catch specific ValueErrors potentially raised by get_expected_values
        # (e.g., if we modified it to raise errors on bad input/no data)
        logger.warning(
            f"Value error during expected values calculation for {request.symbol}, {request.expiry_date}: {ve}"
        )
        # Return 400 Bad Request or 404 Not Found depending on the error meaning
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # Catch-all for other unexpected errors during the route execution
        # or exceptions raised explicitly by get_expected_values
        logger.error(
            f"CONSUMER: Unexpected error in /expected_values route for {request.symbol}, {request.expiry_date}: {e}",
            exc_info=True,
        )
        # Return 500 Internal Server Error
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/selected_contracts")
async def get_selected_contracts():
    try:
        contracts = payoff_consumer.selected_contracts
        return JSONResponse(status_code=200, content=contracts)
    except Exception as e:
        logger.error(
            f"CONSUMER: Error fetching selected contracts: {e}", stack_info=True
        )
        return JSONResponse(status_code=500, content={"message": f"Error: {str(e)}"})


@router.post("/get-graph")
async def subscribeget_graphsymbol():
    msg = await payoff_consumer.get_current_payoff_data()
    return msg


@router.post("/select-option")
async def select_deselect_option(payload: dict = Body(...)):
    # Convert the payload to a JSON string as expected by process_message
    message = json.dumps(payload)
    # Pass the message to the payoff consumer
    res = await payoff_consumer.process_message(message)
    return res


@router.delete("/clear_all_contracts")
async def clear_all_contracts():
    payoff_consumer.selected_contracts = {}
    return None
