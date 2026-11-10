# 🐍 Python AI Assistant

Um assistente de estudos com inteligência artificial desenvolvido para responder perguntas sobre Python utilizando uma base de conhecimento própria em PDF.

O projeto utiliza **RAG (Retrieval-Augmented Generation)** para recuperar informações relevantes de documentos e gerar respostas contextualizadas com o Google Gemini.

## 🚀 Demonstração

- **Aplicação:** [Python AI Assistant](https://python-ai-assistant.vercel.app)
- **Backend:** [API hospedada no Render](https://python-ai-assistant-n524.onrender.com)
- **Documentação da API:** [Swagger UI](https://python-ai-assistant-n524.onrender.com/docs)

## 📌 Sobre o projeto

O Python AI Assistant é uma aplicação web que permite fazer perguntas sobre Python através de uma interface de chat.

Diferente de um chatbot convencional, a aplicação utiliza uma base de conhecimento própria, armazenada em um documento PDF. Quando o usuário envia uma pergunta, o sistema recupera os trechos mais relevantes do documento e os utiliza como contexto para gerar uma resposta com inteligência artificial.

O projeto foi desenvolvido com foco na integração entre backend, frontend e serviços de inteligência artificial, explorando conceitos de RAG, embeddings e bancos de dados vetoriais.

## ✨ Funcionalidades

- Interface de chat para perguntas sobre Python.
- Consulta a uma base de conhecimento em PDF.
- Recuperação contextual de informações utilizando RAG.
- Geração de respostas com Google Gemini.
- Armazenamento e busca vetorial com ChromaDB.
- Respostas formatadas com Markdown.
- Destaque de sintaxe em blocos de código.
- Integração entre frontend e API REST.

## 🛠️ Tecnologias utilizadas

### Backend
- Python
- FastAPI
- LangChain
- ChromaDB
- Google Gemini API
- Pydantic

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- React Markdown
- Lucide React

### Inteligência Artificial
- Google Gemini API para geração de respostas e embeddings.
- LangChain para integração e gerenciamento do fluxo RAG.
- OpenAI Codex como ferramenta de desenvolvimento assistido por IA.

### Deploy
- Render — hospedagem do backend.
- Vercel — hospedagem do frontend.

## 🤖 Utilização de IA no desenvolvimento

O desenvolvimento do frontend contou com o auxílio do **OpenAI Codex**, utilizado como ferramenta de desenvolvimento assistido por inteligência artificial.

A ferramenta foi utilizada para apoiar a criação da interface, implementação de componentes e organização do código, contribuindo para agilizar o desenvolvimento da aplicação.

O projeto também explora a integração de inteligência artificial no próprio backend, utilizando o Google Gemini para geração de embeddings e respostas contextualizadas.

## 🧠 Como funciona

A aplicação utiliza uma arquitetura RAG (Retrieval-Augmented Generation), seguindo este fluxo:

1. Um documento PDF é utilizado como base de conhecimento.
2. O conteúdo do documento é dividido em pequenos trechos (*chunks*).
3. O Google Gemini transforma os textos em embeddings.
4. Os embeddings são armazenados no ChromaDB.
5. Quando o usuário envia uma pergunta, o sistema realiza uma busca vetorial para recuperar os trechos mais relevantes.
6. O LangChain envia a pergunta e o contexto recuperado ao modelo Google Gemini.
7. A resposta gerada é retornada pela API e exibida na interface do usuário.

## 📂 Estrutura do projeto

```text
python-ai-assistant/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── perguntas_routes.py
│   │   ├── main.py
│   │   ├── rag.py
│   │   ├── schemas.py
│   │   └── criar_db.py
│   ├── base/
│   │   └── guia_python_base_conhecimento.pdf
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## ⚙️ Como executar localmente

### Pré-requisitos

- Python 3.10 ou superior.
- Node.js.
- pnpm.
- Chave de API do Google Gemini.

### 1. Clone o repositório

```bash
git clone https://github.com/Luizzhcs/python-ai-assistant.git
cd python-ai-assistant
```

### 2. Configurando o Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie um ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual no Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend`:

```env
GOOGLE_API_KEY=sua_chave_api
```

Inicie a API:

```bash
uvicorn app.main:app --reload
```

A API estará disponível em:

`http://127.0.0.1:8000`

A documentação poderá ser acessada em:

`http://127.0.0.1:8000/docs`

### 3. Configurando o Frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
pnpm install
```

Crie um arquivo `.env` dentro da pasta `frontend`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

O frontend estará disponível em:

`http://localhost:5173`

## 🔐 Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `GOOGLE_API_KEY` | Chave de acesso à API do Google Gemini. |
| `VITE_API_URL` | Endereço da API utilizada pelo frontend. |

**Importante:** Nunca compartilhe suas chaves de API ou envie arquivos `.env` para o GitHub.

## 👨‍💻 Autor

**Luiz Henrique**

- GitHub: [@Luizzhcs](https://github.com/Luizzhcs)

---

Desenvolvido como projeto de portfólio para explorar integração com inteligência artificial, arquiteturas RAG, bancos de dados vetoriais, desenvolvimento de APIs e utilização de ferramentas de IA no desenvolvimento de software.