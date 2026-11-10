import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  ArrowUp,
  Bot,
  BookOpen,
  CircleAlert,
  Code2,
  LoaderCircle,
  Sparkles,
  UserRound,
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

const initialMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Olá! Eu sou o Python AI Assistant. Posso ajudar você a entender conceitos, explorar exemplos e estudar Python com mais clareza. Qual assunto você quer revisar?',
}

function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-3 mt-5 text-xl font-semibold leading-tight text-white first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-3 mt-5 text-lg font-semibold leading-tight text-white first:mt-0">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold leading-tight text-orange-100 first:mt-0">{children}</h3>,
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }) => <em className="text-slate-100">{children}</em>,
          ul: ({ children }) => <ul className="my-3 list-disc space-y-1 pl-5 marker:text-accent">{children}</ul>,
          ol: ({ children }) => <ol className="my-3 list-decimal space-y-1 pl-5 marker:text-accent">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-accent/60 pl-4 italic text-slate-300">{children}</blockquote>
          ),
          hr: () => <hr className="my-5 border-white/10" />,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="font-medium text-orange-200 underline decoration-orange-300/40 underline-offset-4 hover:text-orange-100">
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            const isCodeBlock = !inline && (Boolean(match) || code.includes('\n'))

            if (isCodeBlock) {
              return (
                <div className="my-4 min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#0a1020]">
                  <SyntaxHighlighter
                    {...props}
                    language={match?.[1] || 'python'}
                    style={oneDark}
                    PreTag="div"
                    wrapLongLines
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.82rem',
                      lineHeight: 1.7,
                      overflowX: 'auto',
                    }}
                    codeTagProps={{
                      style: {
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      },
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              )
            }

            return (
              <code {...props} className="rounded-md border border-white/10 bg-black/20 px-1.5 py-0.5 font-mono text-[0.88em] text-orange-100">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-ink shadow-lg shadow-orange-950/20">
          <Bot size={18} strokeWidth={2.3} />
        </div>
      )}

      <div className={`max-w-[min(780px,82%)] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm ${
            isUser
              ? 'rounded-br-md bg-[#e8edf5] text-slate-900'
              : 'rounded-bl-md border border-white/[0.07] bg-white/[0.055] text-slate-200'
          }`}
        >
          {isUser ? message.content : <MarkdownContent content={message.content} />}
        </div>
        <div className={`mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500 ${isUser ? 'text-right' : ''}`}>
          {isUser ? 'Você' : 'Assistente'}
        </div>
      </div>

      {isUser && (
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-slate-300">
          <UserRound size={17} />
        </div>
      )}
    </div>
  )
}

function LoadingMessage() {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-ink shadow-lg shadow-orange-950/20">
        <Bot size={18} strokeWidth={2.3} />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.055] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <LoaderCircle size={16} className="animate-spin text-accent" />
          Pensando...
        </div>
      </div>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState([initialMessage])
  const [question, setQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || isLoading) return

    setError('')
    setQuestion('')
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: 'user', content: trimmedQuestion },
    ])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/perguntas/perguntar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: trimmedQuestion }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || 'Não foi possível obter uma resposta da API.')
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.resposta || 'A API retornou uma resposta vazia.',
        },
      ])
    } catch (requestError) {
      setError(
        requestError.message ||
          'Não foi possível conectar ao assistente. Verifique se a API está em execução.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-orange-400/[0.07] blur-3xl" />
        <div className="absolute -bottom-48 -right-32 h-[460px] w-[460px] rounded-full bg-sky-500/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/[0.07] py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-ink shadow-lg shadow-orange-950/25">
              <Code2 size={21} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white sm:text-base">Python AI Assistant</h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Seu espaço de estudos em Python
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400 sm:flex">
            <BookOpen size={14} className="text-accent" />
            Baseado no seu material
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col py-8 sm:py-12">
          <div className="mb-8 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.08] px-3 py-1.5 text-xs font-medium text-orange-200">
              <Sparkles size={14} />
              Aprenda no seu ritmo
            </div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
              Tire suas dúvidas.
              <span className="block text-slate-400">Entenda Python de verdade.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Faça uma pergunta sobre Python e receba uma explicação baseada no seu material de estudo.
            </p>
          </div>

          <div className="flex min-h-[460px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-panel/75 shadow-glow backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-medium text-white">Conversa de estudos</p>
                <p className="mt-0.5 text-xs text-slate-500">Pergunte qualquer coisa sobre Python</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
                <Bot size={16} />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
              <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && <LoadingMessage />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t border-white/[0.07] bg-[#0e1729]/70 p-4 sm:p-5">
              <div className="mx-auto max-w-3xl">
                {error && (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm leading-5 text-red-200" role="alert">
                    <CircleAlert size={17} className="mt-0.5 shrink-0 text-red-300" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="relative flex items-end gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.055] p-2 transition focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/10">
                  <label htmlFor="question" className="sr-only">Digite sua pergunta</label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        handleSubmit(event)
                      }
                    }}
                    placeholder="Ex.: O que são list comprehensions?"
                    rows={1}
                    disabled={isLoading}
                    className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !question.trim()}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-ink transition hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#0e1729] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"
                    aria-label="Enviar pergunta"
                  >
                    {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowUp size={19} strokeWidth={2.5} />}
                  </button>
                </form>
                <p className="mt-2 px-1 text-[11px] text-slate-600">Pressione Enter para enviar · Shift + Enter para nova linha</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-5 text-center text-[11px] text-slate-600">Python AI Assistant · Feito para aprender melhor</footer>
      </div>
    </main>
  )
}

export default App
