from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.perguntas_routes import perguntas_router

app = FastAPI(
    title="Python AI Assistant API",
    description="API de um assistente de estudos em Python baseado em RAG, LangChain e Gemini.",
    version="1.0.0"
)

app.include_router(perguntas_router)

print("DOCS URL:", app.docs_url)
print("OPENAPI URL:", app.openapi_url)
print("ROTAS:", [getattr(rota, "path", type(rota).__name__) for rota in app.routes])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://python-ai-assistant.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)