from fastapi import APIRouter, HTTPException

from app.rag import responder
from app.schemas import PerguntaSchema


perguntas_router = APIRouter(prefix="/perguntas", tags=["perguntas"])


@perguntas_router.post("/perguntar")
def perguntar(pergunta: PerguntaSchema):
    try:
        resposta = responder(pergunta.pergunta)
        return {"resposta": resposta}
    except Exception as erro:
        print (erro)
        raise HTTPException(status_code=500, detail="Erro ao processar sua pergunta.")


