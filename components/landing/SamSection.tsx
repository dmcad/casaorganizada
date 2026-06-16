'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

const CONVERSATION = [
  { role: 'user', text: 'Tenho algum prazo importante este mês?' },
  {
    role: 'sam',
    text: 'Sim 👇\n• IUC do Peugeot 308 — pagar até 28 de fevereiro.\n• Validar faturas no e-Fatura — até 28 de fevereiro.\nQueres que te avise 5 dias antes?',
  },
  { role: 'user', text: 'Quanto recupero no IRS este ano?' },
  {
    role: 'sam',
    text: 'Com as faturas registadas, estimo ~847 € de dedução. Reparei que pagaste o ginásio sem NIF — se pedires fatura com NIF, podes recuperar mais ~30 €.',
  },
]

export function SamSection() {
  return (
    <section id="sam" className="bg-brand-700 py-16 text-white sm:py-24">
      <div className="container-content grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            🏠 Conhece o SAM
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            O assistente que sabe tudo da tua casa.
          </h2>
          <p className="mt-4 max-w-lg text-lg text-brand-50/90">
            Pergunta qualquer coisa. O SAM sabe quando renova o seguro do carro, quanto vais receber de IRS,
            quais vacinas estão em atraso, e muito mais.
          </p>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Experimenta o SAM
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
              🏠
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">SAM</p>
              <p className="text-xs text-slate-400">A falar sobre: visão geral</p>
            </div>
          </div>
          <div className="space-y-3">
            {CONVERSATION.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-sm bg-brand-500 px-4 py-2.5 text-sm text-white'
                      : 'max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700'
                  }
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
