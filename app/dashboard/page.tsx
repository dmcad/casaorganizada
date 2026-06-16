import Link from 'next/link'
import { CalendarClock, ChevronRight, Sparkles } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MODULES, MODULE_COLOR_CLASSES, canAccess } from '@/lib/modules/registry'
import { getDashboardData } from '@/lib/data/queries'
import { daysUntil, formatDate, formatEuro, cn } from '@/lib/utils'

const MODULE_STATUS: Record<string, { label: string; tone: 'muted' | 'warning' | 'danger' | 'success' }> = {
  financas: { label: 'Gastaram 1.847 € este mês. Orçamento a 74%.', tone: 'success' },
  irs: { label: '847 € estimados de dedução. 3 faturas para validar.', tone: 'warning' },
  documentos: { label: 'CC da Maria expira em 47 dias.', tone: 'warning' },
  automovel: { label: 'IUC do Peugeot: vence em 28 de fevereiro.', tone: 'warning' },
  saude: { label: 'Vacina da gripe do João em atraso.', tone: 'danger' },
  habitacao: { label: 'Renda atualiza em agosto (+3,2% INE).', tone: 'muted' },
  escola: { label: 'Propina de fevereiro: 213 €. ATL renovado.', tone: 'muted' },
}

export default async function DashboardHome() {
  const { profile, documents, transactions } = await getDashboardData()
  const plan = profile.plan

  // Build a 30-day timeline from documents.
  const timeline = documents
    .map((d) => ({
      name: d.name,
      member: d.member_name,
      date: d.expires_at,
      days: daysUntil(d.expires_at),
      module: d.module,
    }))
    .filter((t) => t.days !== null)
    .sort((a, b) => a.days! - b.days!)

  const nextDeadline = timeline.find((t) => (t.days ?? 0) >= 0) ?? timeline[0]
  const monthSpend = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const monthIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const irsDeduction = 847

  const modules = MODULES.filter((m) => m.id !== 'sam')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Olá, família {profile.family_name} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Aqui está o resumo da vida da sua casa hoje.</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Documentos guardados" value={String(documents.length)} hint="2 a expirar em breve" />
        <StatCard label="Dedução IRS estimada" value={formatEuro(irsDeduction)} tone="brand" hint="3 faturas por validar" />
        <StatCard
          label="Próximo prazo"
          value={nextDeadline ? formatDate(nextDeadline.date) : '—'}
          tone="warning"
          hint={nextDeadline?.name}
        />
        <StatCard label="Saldo do mês" value={formatEuro(monthIncome - monthSpend)} tone="success" hint={`Gasto: ${formatEuro(monthSpend)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-brand-500" />
              <h2 className="font-semibold text-slate-900">Próximos 30 dias e além</h2>
            </div>
            <ol className="space-y-2">
              {timeline.map((t) => {
                const overdue = (t.days ?? 0) < 0
                const soon = (t.days ?? 0) >= 0 && (t.days ?? 0) <= 60
                const color = MODULE_COLOR_CLASSES[(MODULES.find((m) => m.id === t.module)?.color) ?? 'blue']
                return (
                  <li key={t.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', overdue ? 'bg-danger' : soon ? 'bg-amber-400' : 'bg-slate-300')} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">
                        {t.member ? `${t.member} · ` : ''}
                        {formatDate(t.date)}
                      </p>
                    </div>
                    <Badge variant={overdue ? 'danger' : soon ? 'warning' : 'muted'}>
                      {overdue ? `Há ${Math.abs(t.days!)} dias` : `${t.days} dias`}
                    </Badge>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        {/* SAM tip + quick actions */}
        <Card>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-brand-50 p-4">
              <div className="flex items-center gap-2 text-brand-700">
                <Sparkles className="h-4 w-4" />
                <p className="text-sm font-semibold">Dica do SAM</p>
              </div>
              <p className="mt-2 text-sm text-brand-800/90">
                Pediu fatura sem NIF no ginásio este mês. Vai perder cerca de <strong>30 €</strong> no IRS. Peça
                sempre fatura com NIF.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Ações rápidas</p>
              <div className="space-y-1.5">
                <QuickAction href="/dashboard/documentos" label="Adicionar documento" />
                <QuickAction href="/dashboard/financas" label="Registar despesa" />
                <QuickAction href="/dashboard/irs" label="Validar faturas" />
                <QuickAction href="/dashboard/sam" label="Falar com o SAM" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module grid */}
      <div>
        <h2 className="mb-3 font-semibold text-slate-900">Os seus módulos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon
            const colors = MODULE_COLOR_CLASSES[m.color]
            const status = MODULE_STATUS[m.id]
            const locked = !canAccess(plan, m.plan)
            return (
              <Link
                key={m.id}
                href={locked ? '/pricing' : m.route}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.iconBg)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {locked ? <Badge variant="warning">Pro</Badge> : <ChevronRight className="h-4 w-4 text-slate-300" />}
                </div>
                <p className="mt-3 font-semibold text-slate-900">{m.name}</p>
                <p className={cn('mt-1 text-sm', status?.tone === 'danger' ? 'text-danger' : status?.tone === 'warning' ? 'text-amber-600' : 'text-slate-500')}>
                  {locked ? 'Disponível no plano Pro.' : status?.label ?? m.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    >
      {label}
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </Link>
  )
}
