'use client'

import { useRef, useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { getSamReply, SAM_SUGGESTIONS } from '@/components/sam/samDemo'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Message = {
  id: 0,
  role: 'assistant',
  content:
    'Olá! Sou o **SAM**, o assistente da Casa Organizada 🏠\n\nJá dei uma vista de olhos: o **CC da Maria** expira em 47 dias e tens o **IUC** a vencer em fevereiro. Em que posso ajudar?',
}

/** Renders **bold** segments; everything else is plain text with line breaks. */
function renderContent(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i} className="block">
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{part}</span>
        ),
      )}
    </span>
  ))
}

export function SamChat({ compact = false, moduleLabel }: { compact?: boolean; moduleLabel?: string }) {
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg: Message = { id: Date.now(), role: 'user', content: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = getSamReply(trimmed)
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', content: reply.text }])
      setTyping(false)
    }, 650)
  }

  return (
    <div className="flex h-full flex-col">
      {moduleLabel && (
        <div className="border-b border-slate-100 px-4 py-2 text-xs text-slate-400">
          A falar sobre: <span className="font-medium text-slate-600">{moduleLabel}</span>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                m.role === 'user'
                  ? 'rounded-br-sm bg-brand-500 text-white'
                  : 'rounded-bl-sm bg-slate-100 text-slate-700',
              )}
            >
              {renderContent(m.content)}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {(compact ? SAM_SUGGESTIONS.slice(0, 2) : SAM_SUGGESTIONS).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-center gap-2 border-t border-slate-100 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunta ao SAM…"
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          disabled={!input.trim()}
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

function Dot({ delay = '0s' }: { delay?: string }) {
  return (
    <span
      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
      style={{ animationDelay: delay }}
    />
  )
}
