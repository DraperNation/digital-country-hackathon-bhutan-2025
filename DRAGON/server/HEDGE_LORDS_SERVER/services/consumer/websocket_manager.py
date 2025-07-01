from fastapi import WebSocket
from typing import Optional, Dict


class ConnectionManager:
    def __init__(self):
        # Store WebSocket connections in a dictionary
        self.active_connections: Dict[str, Optional[WebSocket]] = {
            "premiums": None,
            "trading": None,
        }

    async def connect(self, websocket: WebSocket, connection_name: str):
        await websocket.accept()
        # Disconnect any existing connection for the given name
        if self.active_connections.get(connection_name):
            await self.disconnect(connection_name)
        self.active_connections[connection_name] = websocket
        print(f"Connected to {connection_name} WebSocket.")

    async def disconnect(self, connection_name: str):
        websocket = self.active_connections.get(connection_name)
        if websocket:
            self.active_connections[connection_name] = None
            print(f"Disconnected from {connection_name} WebSocket.")

    async def broadcast(self, message: dict, connection_name: str):
        websocket = self.active_connections.get(connection_name)
        if websocket:
            try:
                await websocket.send_json(message)
            except Exception:
                await self.disconnect(connection_name)


manager = ConnectionManager()
