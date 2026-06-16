'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { formatDate, formatEuro, cn } from '@/lib/utils'
import { createTransaction } from '@/app/dashboard/actions'
import type { BudgetCategory, Transaction } from '@/types/modules'

export function FinancasView({
  transactions,
  budget,
}: {
  transactions: Transaction[]
  budget: BudgetCategory[]
}) {
  const [open, setOpen] = useState(false)

  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const budgetTotal = budget.reduce((s, b) => s + (b.monthly_limit ?? 0), 0)
  const budgetSpent = budget.reduce((s, b) => s + (b.spent ?? 0), 0)
  const usedPct = budgetTotal > 0 ? Math.round((budgetSpent / budgetTotal) * 100) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finanças Familiares"
        description="Orçamento, despesas e poupança da família — num relance."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Registar movimento
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Receitas do mês" value={formatEuro(income)} tone="success" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Despesas do mês" value={formatEuro(expense)} tone="danger" icon={<TrendingDown className="h-4 w-4" />} />
        <StatCard label="Saldo do mês" value={formatEuro(income - expense)} tone="brand" />
        <StatCard label="Orçamento usado" value={`${usedPct}%`} tone="warning" hint={`${formatEuro(budgetSpent)} de ${formatEuro(budgetTotal)}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold text-slate-900">Orçamento por categoria</h2>
            {budget.length === 0 ? (
              <p className="text-sm text-slate-400">Ainda não definiu categorias de orçamento.</p>
            ) : (
              <div className="space-y-4">
                {budget.map((b) => {
                  const pct = b.monthly_limit ? Math.round(((b.spent ?? 0) / b.monthly_limit) * 100) : 0
                  const over = pct >= 100
                  const near = pct >= 85 && pct < 100
                  return (
                    <div key={b.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {b.icon} {b.name}
                        </span>
                        <span className={cn('tabular', over ? 'text-danger' : near ? 'text-amber-600' : 'text-slate-500')}>
                          {formatEuro(b.spent ?? 0)} / {formatEuro(b.monthly_limit ?? 0)}
                        </span>
                      </div>
                      <Progress value={pct} barClassName={over ? 'bg-danger' : near ? 'bg-amber-400' : 'bg-brand-500'} />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="mb-4 font-semibold text-slate-900">Despesas dos últimos 6 meses</h2>
            <MonthlyChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold text-slate-900">Movimentos recentes</h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-400">Sem movimentos registados. Use “Registar movimento” para começar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-2 pr-4 font-medium">Data</th>
                    <th className="pb-2 pr-4 font-medium">Descrição</th>
                    <th className="pb-2 pr-4 font-medium">Categoria</th>
                    <th className="pb-2 pr-4 font-medium">NIF</th>
                    <th className="pb-2 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3 pr-4 text-slate-500">{formatDate(t.date)}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-slate-900">{t.description}</p>
                        <p className="text-xs text-slate-400">{t.merchant}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-500">{t.category_name ?? '—'}</td>
                      <td className="py-3 pr-4">
                        {t.nif_requested ? <Badge variant="success">Com NIF</Badge> : <Badge variant="muted">Sem NIF</Badge>}
                      </td>
                      <td className={cn('tabular py-3 text-right font-medium', t.type === 'income' ? 'text-emerald-600' : 'text-slate-900')}>
                        {t.type === 'income' ? '+' : '−'} {formatEuro(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransactionModal open={open} onClose={() => setOpen(false)} budget={budget} />
    </div>
  )
}

function MonthlyChart() {
  const data = [
    { m: 'Jan', v: 1620 },
    { m: 'Fev', v: 1980 },
    { m: 'Mar', v: 1740 },
    { m: 'Abr', v: 2120 },
    { m: 'Mai', v: 1890 },
    { m: 'Jun', v: 1847 },
  ]
  const max = Math.max(...data.map((d) => d.v))
  return (
    <div className="flex h-44 items-end gap-3">
      {data.map((d) => (
        <div key={d.m} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-brand-400 transition-all hover:bg-brand-500"
              style={{ height: `${(d.v / max) * 100}%` }}
              title={formatEuro(d.v)}
            />
          </div>
          <span className="text-xs text-slate-400">{d.m}</span>
        </div>
      ))}
    </div>
  )
}

function AddTransactionModal({
  open,
  onClose,
  budget,
}: {
  open: boolean
  onClose: () => void
  budget: BudgetCategory[]
}) {
  const [saving, setSaving] = useState(false)
  return (
    <Modal open={open} onClose={onClose} title="Registar movimento">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          await createTransaction(new FormData(e.currentTarget))
          setSaving(false)
          onClose()
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Select label="Tipo" name="type" defaultValue="expense">
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </Select>
          <Input label="Valor (€)" name="amount" type="number" step="0.01" placeholder="0,00" />
          <Input label="Descrição" name="description" placeholder="Compras supermercado" />
          <Input label="Comerciante" name="merchant" placeholder="Pingo Doce" />
          <Select label="Categoria" name="category_id">
            {budget.map((b) => (
              <option key={b.id} value={b.id}>
                {b.icon} {b.name}
              </option>
            ))}
          </Select>
          <Input label="Data" name="date" type="date" />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="nif_requested" className="h-4 w-4 rounded accent-brand-500" defaultChecked />
          Pedi fatura com NIF (conta para o IRS)
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'A guardar…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
