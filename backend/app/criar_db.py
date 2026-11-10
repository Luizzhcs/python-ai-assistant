import logging
import shutil
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

PASTA_BASE = Path(__file__).resolve().parent.parent / "base"
CAMINHO_DB = "db"


def criar_db():
    logger.info("Iniciando criação do banco vetorial.")
    documentos = carregar_documentos()
    chunks = dividir_chuncks(documentos)
    vetorizar_chunks(chunks)
    logger.info("Banco vetorial criado com sucesso.")


def carregar_documentos():
    caminho_base = PASTA_BASE.resolve()
    pasta_existe = caminho_base.exists() and caminho_base.is_dir()
    logger.info("Pasta base: %s | existe=%s", caminho_base, pasta_existe)

    if not pasta_existe:
        raise FileNotFoundError(
            f"A pasta base não foi encontrada: {caminho_base}"
        )

    pdfs_encontrados = sorted(caminho_base.glob("*.pdf"))
    logger.info(
        "PDFs encontrados na pasta base antes do PyPDFDirectoryLoader: %d | arquivos=%s",
        len(pdfs_encontrados),
        [pdf.name for pdf in pdfs_encontrados],
    )

    carregador = PyPDFDirectoryLoader(str(caminho_base), glob="*.pdf")
    documentos = carregador.load()

    logger.info(
        "PyPDFDirectoryLoader carregou %d documento(s) a partir de %s.",
        len(documentos),
        caminho_base,
    )

    if not documentos:
        raise RuntimeError(
            "Nenhum documento foi carregado pelo PyPDFDirectoryLoader "
            f"a partir de {caminho_base}. Verifique se há arquivos PDF válidos."
        )

    total_caracteres = sum(
        len(documento.page_content or "") for documento in documentos
    )
    logger.info("Total de caracteres extraídos dos documentos: %d.", total_caracteres)

    return documentos


def dividir_chuncks(documentos):
    separador_documentos = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=500,
        length_function=len,
        add_start_index=True
    )
    chunks = separador_documentos.split_documents(documentos)
    logger.info("Total de chunks gerados: %d.", len(chunks))

    if not chunks:
        raise RuntimeError(
            "Nenhum chunk foi gerado a partir dos documentos carregados. "
            "Verifique o conteúdo extraído e a configuração do splitter."
        )

    return chunks


def vetorizar_chunks(chunks):
    # Apaga o db antigo (gerado com MiniLM, incompatível com Gemini)
    shutil.rmtree(CAMINHO_DB, ignore_errors=True)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

    # Indexa em lotes para evitar erro 429 (limite de requisições da API)
    db = Chroma(persist_directory=CAMINHO_DB, embedding_function=embeddings)
    tamanho_lote = 50
    for i in range(0, len(chunks), tamanho_lote):
        lote = chunks[i:i + tamanho_lote]
        db.add_documents(lote)
        logger.info("Indexados %d/%d chunks.", min(i + tamanho_lote, len(chunks)), len(chunks))


criar_db()