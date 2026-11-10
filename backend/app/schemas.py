from pydantic import BaseModel

class PerguntaSchema(BaseModel):
    pergunta: str
    
    class Config:
        from_attributes: True