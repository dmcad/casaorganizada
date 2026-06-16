'use client'

import { CalendarDays, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Alert } from '@/components/ui/Alert'
import {
  IRS_RULES_2025,
  IRS_CATEGORY_LABELS,
  IRS_CALENDAR,
  computeDeduction,
  type IrsCategory,
} from '@/lib/irs/deductions'
import { daysUntil, formatDate, formatEuro, cn } from '@/lib/utils'

// Demo: amount spent per category this tax year.
const SPENT: Partial<Record<IrsCategory, number>> = {
  saude: 945,
  educacao: 213,
  geral: 6800,
  habitacao_renda: 4200,
  iva_beneficio: 480,
}

export default function IRSPage() {
  const rows = (Object.keys(SPENT) as IrsCategory[]).map((cat) => {
    const spent = SPENT[cat] ?? 0
    const calc = computeDeduction(cat, spent)
    return { cat, spent, ...calc }
  })
  const totalDeduction = rows.reduce((s, r) => s + r.deduction, 0)
  const totalLost = rows.reduce((s, r) => s + r.lostToCap, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="IRS e e-Fatura"
        description="Faturas, deduções e calendário fiscal — para o ano de 2025 (entrega 2026)."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Dedução estimada" value={formatEuro(totalDeduction)} tone="brand" />
        <StatCard label="Perdido por limites" value={formatEuro(totalLost)} tone="warning" hint="Acima dos tetos legais" />
        <StatCard label="Faturas por validar" value="3" tone="danger" hint="Até 28 de fevereiro" />
      </div>

      <Alert variant="warning" title="3 faturas por validar no e-Fatura">
        Validar até <strong>28 de fevereiro</strong>. Faturas pendentes de classificação podem não contar para a
        dedução.
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category breakdown */}
        <Card className="lg:col-span-2">
          <CardContent>
            <h2 className="mb-4 font-semibold text-slate-900">Deduções por categoria</h2>
            <div className="space-y-5">
              {rows.map((r) => {
                const pct = Math.round((r.deduction / r.max) * 100)
                return (
                  <div key={r.cat}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{IRS_CATEGORY_LABELS[r.cat]}</span>
                      <span className="tabular text-slate-600">
                        {formatEuro(r.deduction)}
                        <span className="text-slate-400"> / {formatEuro(r.max)}</span>
                      </span>
                    </div>
                    <Progress value={pct} barClassName={r.capReached ? 'bg-amber-400' : 'bg-brand-500'} />
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                      <span>
                        Gasto {formatEuro(r.spent)} · taxa {Math.round(r.rate * 100)}%
                      </span>
                      {r.capReached && <span className="text-amber-600">Limite atingido</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Fiscal calendar */}
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-brand-500" />
              <h2 className="font-semibold text-slate-900">Calendário fiscal</h2>
            </div>
            <ol className="space-y-3">
              {IRS_CALENDAR.map((c) => {
                const days = daysUntil(c.date)
                const past = (days ?? 0) < 0
                return (
                  <li key={c.key} className="flex items-start gap-3">
                    <span className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', past ? 'bg-slate-300' : c.critical ? 'bg-danger' : 'bg-amber-400')} />
                    <div>
                      <p className={cn('text-sm font-medium', past ? 'text-slate-400 line-through' : 'text-slate-900')}>
                        {c.label}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(c.date)}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Missing deductions */}
      <Card>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-slate-900">Deduções em risco</h2>
          </div>
          <div className="space-y-3">
            <MissingRow
              title="Ginásio sem NIF — 39,90 €/mês"
              detail="O benefício de IVA (30%) não pode ser adicionado manualmente. Peça sempre fatura com NIF."
              impact="≈ 30 € perdidos"
              critical
            />
            <MissingRow
              title="Explicações sem NIF — 120 €"
              detail="Educação deduz a 30%. Ainda pode pedir a fatura com NIF ao centro de explicações."
              impact="≈ 36 € recuperáveis"
            />
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400">
        Valores indicativos com base nas regras de IRS de 2025. Não substitui o aconselhamento de um TOC.
      </p>
    </div>
  )
}

function MissingRow({
  title,
  detail,
  impact,
  critical,
}: {
  title: string
  detail: string
  impact: string
  critical?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 p-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
      </div>
      <Badge variant={critical ? 'danger' : 'warning'} className="shrink-0">
        {impact}
      </Badge>
    </div>
  )
}
