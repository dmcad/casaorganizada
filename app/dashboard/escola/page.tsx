import { GraduationCap, BookOpen, Receipt } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UpgradeGate } from '@/components/billing/UpgradeGate'
import { canAccess } from '@/lib/modules/registry'
import { DEMO_PROFILE } from '@/lib/demo/data'
import { formatEuro } from '@/lib/utils'

export default function EscolaPage() {
  if (!canAccess(DEMO_PROFILE.plan, 'pro')) return <UpgradeGate moduleId="escola" />

  return (
    <div className="space-y-6">
      <PageHeader title="Escola e Filhos" description="Propinas, ATL, manuais e documentos escolares." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-slate-900">Propinas e ATL</h2>
            </div>
            <div className="space-y-3">
              <Item icon="🎒" name="ATL — Tomás" detail="Fevereiro" amount={formatEuro(120)} status="success" statusLabel="Pago" />
              <Item icon="📚" name="Explicações matemática" detail="Centro de Estudos" amount={formatEuro(120)} status="warning" statusLabel="Sem NIF" />
              <Item icon="🍽️" name="Refeições escolares — Ana" detail="Fevereiro" amount={formatEuro(48)} status="success" statusLabel="Pago" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-slate-900">Documentos escolares</h2>
            </div>
            <div className="space-y-3">
              <Item icon="📄" name="Matrícula 2025/26 — Tomás" detail="Confirmada" status="success" statusLabel="OK" />
              <Item icon="💉" name="Boletim de vacinas — Ana" detail="Atualizado" status="success" statusLabel="OK" />
              <Item icon="🪪" name="Seguro escolar" detail="Incluído na propina" status="muted" statusLabel="Ativo" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-brand-500" />
          <p className="text-sm text-slate-600">
            Despesas de educação deduzem <strong>30%</strong> no IRS (até {formatEuro(800)}). Peça sempre fatura com NIF.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function Item({
  icon,
  name,
  detail,
  amount,
  status,
  statusLabel,
}: {
  icon: string
  name: string
  detail: string
  amount?: string
  status: 'success' | 'warning' | 'muted'
  statusLabel: string
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs text-slate-400">{detail}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {amount && <span className="tabular text-sm font-medium text-slate-700">{amount}</span>}
        <Badge variant={status}>{statusLabel}</Badge>
      </div>
    </div>
  )
}
