import { Home, FileText, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { Card, CardContent } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { UpgradeGate } from '@/components/billing/UpgradeGate'
import { canAccess } from '@/lib/modules/registry'
import { getProfile } from '@/lib/data/queries'
import { formatEuro } from '@/lib/utils'

export default async function HabitacaoPage() {
  const profile = await getProfile()
  if (!canAccess(profile.plan, 'pro')) return <UpgradeGate moduleId="habitacao" />

  return (
    <div className="space-y-6">
      <PageHeader title="Habitação" description="Contratos, renda, condomínio e garantias da casa." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Renda mensal" value={formatEuro(850)} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Condomínio" value={formatEuro(45)} hint="Pago até dia 8" />
        <StatCard label="Dedução IRS (renda)" value={formatEuro(700)} tone="brand" hint="Limite anual atingido" />
      </div>

      <Alert variant="info" title="Atualização de renda em agosto">
        Com base no coeficiente do INE, a renda poderá atualizar <strong>+3,2%</strong> (≈ {formatEuro(27.2)}/mês).
      </Alert>

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            <h2 className="font-semibold text-slate-900">Documentos e garantias</h2>
          </div>
          <div className="space-y-3">
            <DocRow name="Contrato de Arrendamento" detail="Válido · renova em 2027" />
            <DocRow name="Garantia caldeira" detail="Vodafone · termina jul 2027" />
            <DocRow name="Apólice multirriscos habitação" detail="Renova em set" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DocRow({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
      <TrendingUp className="h-4 w-4 text-slate-300" />
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  )
}
