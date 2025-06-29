from typing import List, Union
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class QueryRequest(BaseModel):
    question: str
    chat_history: List[Message]
    model: str


class CreateVectorDBRequest(BaseModel):
    model: str
    uploaded_file: str


class DeleteDocRequest(BaseModel):
    model: str
    file_name: str


class ChatHistory(BaseModel):
    chat_history: List[Message] 