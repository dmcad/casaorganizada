'use client'

import { useState } from 'react'
import { Plus, MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card } from '@/components/ui/Card'
import { SamChat } from '@/components/sam/SamChat'
import { cn } from '@/lib/utils'

const HISTORY = [
  { id: 1, title: 'Deduções de IRS 2025', date: 'Hoje' },
  { id: 2, title: 'Renovação do CC da Maria', date: 'Ontem' },
  { id: 3, title: 'Comparar seguros do Peugeot', date: '12 jun' },
]

export default function SamPage() {
  const [active, setActive] = useState(1)

  return (
    <div className="space-y-6">
      <PageHeader title="SAM — Assistente" description="O assistente inteligente que conhece a vida da sua casa." />

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="hidden lg:col-span-1 lg:block">
          <div className="border-b border-slate-100 p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600">
              <Plus className="h-4 w-4" /> Nova conversa
            </button>
          </div>
          <div className="p-2">
            {HISTORY.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(h.id)}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left text-sm',
                  active === h.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50',
                )}
              >
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{h.title}</p>
                  <p className="text-xs text-slate-400">{h.date}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex h-[70vh] flex-col overflow-hidden lg:col-span-3">
          <SamChat moduleLabel="visão geral" />
        </Card>
      </div>
    </div>
  )
}
