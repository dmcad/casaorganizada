import { Syringe, Stethoscope, Pill } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { UpgradeGate } from '@/components/billing/UpgradeGate'
import { canAccess } from '@/lib/modules/registry'
import { getProfile, getFamilyMembers } from '@/lib/data/queries'

export default async function SaudePage() {
  const [profile, members] = await Promise.all([getProfile(), getFamilyMembers()])
  if (!canAccess(profile.plan, 'pro')) return <UpgradeGate moduleId="saude" />

  return (
    <div className="space-y-6">
      <PageHeader title="Saúde Familiar" description="Historial médico, vacinas e medicação de cada membro." />

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Syringe className="h-5 w-5 text-rose-500" />
            <h2 className="font-semibold text-slate-900">Vacinas</h2>
          </div>
          <div className="space-y-3">
            <Row icon="💉" name="Vacina da gripe — João" date="Em atraso desde out." status="danger" />
            <Row icon="💉" name="Tétano — Maria" date="Próxima: 2028" status="success" />
            <Row icon="💉" name="Boletim Tomás" date="Atualizado" status="success" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-rose-500" />
              <h2 className="font-semibold text-slate-900">Próximas consultas</h2>
            </div>
            <div className="space-y-3">
              <Row icon="🩺" name="Pediatria — Ana" date="22 jun · Dra. Sofia" status="info" />
              <Row icon="🦷" name="Dentista — João" date="04 jul · Clínica Lusíadas" status="info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-rose-500" />
              <h2 className="font-semibold text-slate-900">Medicação ativa</h2>
            </div>
            <div className="space-y-3">
              <Row icon="💊" name="Vitamina D — Maria" date="1x/dia" status="muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-slate-400">{members.length} membros no agregado familiar.</p>
    </div>
  )
}

function Row({
  icon,
  name,
  date,
  status,
}: {
  icon: string
  name: string
  date: string
  status: 'danger' | 'success' | 'info' | 'muted'
}) {
  const label = { danger: 'Em atraso', success: 'Em dia', info: 'Agendada', muted: 'Ativa' }[status]
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-slate-900">{name}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
      <Badge variant={status}>{label}</Badge>
    </div>
  )
}
