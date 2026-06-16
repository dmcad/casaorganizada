'use client'

import { useState } from 'react'
import { Plus, Car, ShieldCheck, Wrench, FileCheck } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { DEMO_VEHICLES } from '@/lib/demo/data'
import { daysUntil, deadlineLabel, formatDate } from '@/lib/utils'

export default function AutomovelPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automóvel"
        description="IUC, seguro, inspeção e revisão — sem surpresas nem multas."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Adicionar veículo
          </Button>
        }
      />

      <Alert variant="warning" title="Novo em 2026: IUC com prazo único">
        O Imposto Único de Circulação passa a ter prazo único em <strong>fevereiro</strong>. Pague a tempo para
        evitar coimas.
      </Alert>

      {DEMO_VEHICLES.map((v) => {
        const iucDays = daysUntil(v.iuc_due)
        return (
          <Card key={v.id}>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{v.name}</p>
                    <p className="tabular text-sm text-slate-500">{v.plate}</p>
                  </div>
                </div>
                <Badge variant={iucDays !== null && iucDays <= 60 ? 'warning' : 'muted'}>
                  IUC {formatDate(v.iuc_due)}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <AlertCard
                  icon={<FileCheck className="h-5 w-5" />}
                  label="IUC"
                  value={formatDate(v.iuc_due)}
                  note="Prazo único — fevereiro"
                  tone="warning"
                />
                <AlertCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Seguro"
                  value={deadlineLabel(v.insurance_due)}
                  note="Fidelidade · renova automaticamente"
                  tone="default"
                />
                <AlertCard
                  icon={<Wrench className="h-5 w-5" />}
                  label="Inspeção (IPO)"
                  value={deadlineLabel(v.inspection_due)}
                  note="Centro de inspeções"
                  tone="default"
                />
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <Button variant="secondary" size="sm">
                  Comparar seguros
                </Button>
                <Button variant="ghost" size="sm">
                  Ver documentos do veículo
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Modal open={open} onClose={() => setOpen(false)} title="Adicionar veículo">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setOpen(false)
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Marca e modelo" placeholder="Peugeot 308" />
            <Input label="Matrícula" placeholder="00-AB-00" />
            <Input label="Vencimento do seguro" type="date" />
            <Input label="Próxima inspeção" type="date" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar veículo</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function AlertCard({
  icon,
  label,
  value,
  note,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  note: string
  tone: 'warning' | 'default'
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={tone === 'warning' ? 'mt-2 font-semibold text-amber-600' : 'mt-2 font-semibold text-slate-900'}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-slate-400">{note}</p>
    </div>
  )
}
