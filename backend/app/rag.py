from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

CAMINHO_DB = "db"

prompt_template = """
Você é um assistente de estudos especializado em Python.

Responda à pergunta do usuário utilizando exclusivamente as informações
disponíveis na base de conhecimento abaixo.

Se a resposta não estiver presente na base de conhecimento,
informe que não encontrou informações suficientes no material.
Não utilize conhecimentos externos e não invente informações.

Sempre que possível, indique a página do PDF de onde a informação foi extraída.

Pergunta:
{pergunta}

Base de conhecimento:
{base_conhecimento}
"""

def responder(pergunta: str) -> str:
   
    
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    db = Chroma(
        persist_directory=CAMINHO_DB,
        embedding_function=embeddings
    )

    resultados = db.similarity_search_with_relevance_scores(pergunta, k=4)

    if not resultados or resultados[0][1] < 0.35:
        return "Não encontrei informações relevantes na base de conhecimento"
        
    textos_resultado = []
    
    for resultado in resultados: 
        documento = resultado[0]
        texto = documento.page_content
        pagina = documento.metadata["page"] + 1
        
        textos_resultado.append(f"Página {pagina}:\n{texto}")
    base_conhecimento = "\n\n----\n\n".join(textos_resultado)
    
    prompt = ChatPromptTemplate.from_template(prompt_template)
    prompt = prompt.invoke({"pergunta": pergunta, "base_conhecimento": base_conhecimento})
    
    modelo = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")
    resposta = modelo.invoke(prompt).content

    if isinstance(resposta, list):
        resposta = "\n".join(
            bloco["text"] for bloco in resposta
            if bloco.get("type") == "text"
        )

    return resposta
    
    
