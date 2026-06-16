import { NextResponse } from 'next/server'
import { buildSamSystemPrompt, type SamContext } from '@/lib/sam/system-prompt'
import { getSamReply } from '@/components/sam/samDemo'
import {
  DEMO_DOCUMENTS,
  DEMO_PROFILE,
  DEMO_TRANSACTIONS,
} from '@/lib/demo/data'

export const runtime = 'nodejs'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function demoContext(module: string | null): SamContext {
  return {
    module,
    familyName: DEMO_PROFILE.family_name,
    plan: DEMO_PROFILE.plan,
    upcomingDeadlines: DEMO_DOCUMENTS.filter((d) => d.expires_at).map((d) => ({
      label: d.name,
      date: d.expires_at!,
      module: d.module,
    })),
    recentTransactions: DEMO_TRANSACTIONS.map((t) => ({
      date: t.date,
      description: t.description,
      merchant: t.merchant,
      amount: t.amount,
      type: t.type,
    })),
    documents: DEMO_DOCUMENTS.map((d) => ({
      name: d.name,
      category: d.category,
      expires_at: d.expires_at,
      member: d.member_name ?? null,
    })),
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    messages?: ChatMessage[]
    module?: string | null
  }
  const messages = body.messages ?? []
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
  const apiKey = process.env.OPENAI_API_KEY

  // Demo mode — no key configured. Return the rule-based reply.
  if (!apiKey) {
    return NextResponse.json({ role: 'assistant', content: getSamReply(lastUser).text, mode: 'demo' })
  }

  const system = buildSamSystemPrompt(demoContext(body.module ?? null))

  const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      stream: true,
      temperature: 0.4,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  })

  if (!upstream.ok || !upstream.body) {
    // Fallback to demo reply if the upstream call fails.
    return NextResponse.json({ role: 'assistant', content: getSamReply(lastUser).text, mode: 'fallback' })
  }

  // Re-stream OpenAI SSE deltas as plain text tokens.
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const data = trimmed.slice(5).trim()
          if (data === '[DONE]') {
            controller.close()
            return
          }
          try {
            const json = JSON.parse(data)
            const token = json.choices?.[0]?.delta?.content
            if (token) controller.enqueue(encoder.encode(token))
          } catch {
            // ignore malformed keep-alive lines
          }
        }
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}
