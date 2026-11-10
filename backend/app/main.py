from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.perguntas_routes import perguntas_router

app = FastAPI(title="Python AI Assistant API", description="API de um assistente de estudos em Python baseado em RAG, LangChain e Gemini.", version="1.0.0")

app.include_router(perguntas_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)