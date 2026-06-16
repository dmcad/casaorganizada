'use client'

import { useState } from 'react'
import { Plus, FileText, Bell } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { FileUpload } from '@/components/ui/FileUpload'
import { Input, Select } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { daysUntil, deadlineLabel, formatDate } from '@/lib/utils'
import { createDocument } from '@/app/dashboard/actions'
import type { DocumentRecord, FamilyMember } from '@/types/modules'

const CATEGORY_LABEL: Record<string, string> = {
  cc: 'Cartão de Cidadão',
  passaporte: 'Passaporte',
  carta: 'Carta de Condução',
  seguro: 'Seguro',
  contrato: 'Contrato',
}

function expiryBadge(doc: DocumentRecord) {
  const days = daysUntil(doc.expires_at)
  if (days === null) return <Badge variant="muted">Sem validade</Badge>
  if (days < 0) return <Badge variant="danger">Expirado</Badge>
  if (days <= doc.alert_days) return <Badge variant="warning">{deadlineLabel(doc.expires_at)}</Badge>
  return <Badge variant="success">Válido</Badge>
}

export function DocumentosView({
  documents,
  members,
}: {
  documents: DocumentRecord[]
  members: FamilyMember[]
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'upload' | 'confirm'>('upload')

  const expiring = [...documents]
    .filter((d) => daysUntil(d.expires_at) !== null)
    .sort((a, b) => daysUntil(a.expires_at)! - daysUntil(b.expires_at)!)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos e Prazos"
        description="Todos os documentos da família, com alertas automáticos de validade."
        action={
          <Button
            onClick={() => {
              setOpen(true)
              setStep('upload')
            }}
          >
            <Plus className="h-4 w-4" /> Adicionar documento
          </Button>
        }
      />

      {expiring.length > 0 && (
        <Card>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              <h2 className="font-semibold text-slate-900">Linha temporal de validades</h2>
            </div>
            <div className="space-y-2">
              {expiring.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.name}</p>
                    <p className="text-xs text-slate-400">
                      {d.member_name ?? 'Família'} · {formatDate(d.expires_at)}
                    </p>
                  </div>
                  {expiryBadge(d)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {documents.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((d) => (
            <Card key={d.id} className="transition-shadow hover:shadow-md">
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  {expiryBadge(d)}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <p className="text-sm text-slate-500">{CATEGORY_LABEL[d.category] ?? d.category}</p>
                </div>
                <dl className="space-y-1 border-t border-slate-100 pt-3 text-xs">
                  <Row label="Titular" value={d.member_name ?? 'Família'} />
                  <Row label="Emissor" value={d.issuer ?? '—'} />
                  <Row label="Validade" value={formatDate(d.expires_at)} />
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddDocumentModal open={open} onClose={() => setOpen(false)} step={step} setStep={setStep} members={members} />
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <FileText className="h-6 w-6" />
        </div>
        <p className="font-medium text-slate-900">Ainda não há documentos</p>
        <p className="max-w-sm text-sm text-slate-500">
          Adicione o primeiro documento — um CC ou passaporte — e o SAM trata da extração e dos alertas.
        </p>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" /> Adicionar documento
        </Button>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-600">{value}</dd>
    </div>
  )
}

function AddDocumentModal({
  open,
  onClose,
  step,
  setStep,
  members,
}: {
  open: boolean
  onClose: () => void
  step: 'upload' | 'confirm'
  setStep: (s: 'upload' | 'confirm') => void
  members: FamilyMember[]
}) {
  const [saving, setSaving] = useState(false)
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Adicionar documento"
      description="Envie um ficheiro e o SAM extrai os dados automaticamente."
    >
      {step === 'upload' ? (
        <div className="space-y-4">
          <FileUpload onFile={() => setStep('confirm')} />
          <Alert variant="info">
            Após o envio, analisamos o documento e pré-preenchemos os campos. Confirma antes de guardar.
          </Alert>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            await createDocument(new FormData(e.currentTarget))
            setSaving(false)
            onClose()
            setStep('upload')
          }}
        >
          <Alert variant="success" title="Dados extraídos">
            Confirme ou edite os campos detetados pelo SAM.
          </Alert>
          <input type="hidden" name="module" value="documentos" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome do documento" name="name" defaultValue="Cartão de Cidadão" />
            <Select label="Categoria" name="category" defaultValue="cc">
              {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
            <Select label="Titular" name="member_id" defaultValue={members[0]?.id}>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
            <Input label="Emissor" name="issuer" defaultValue="IRN" />
            <Input label="Data de emissão" name="issued_at" type="date" defaultValue="2016-08-01" />
            <Input label="Validade" name="expires_at" type="date" defaultValue="2026-08-01" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep('upload')}>
              Voltar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar documento'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
