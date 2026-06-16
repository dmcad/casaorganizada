'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { addFamilyMember } from '@/app/dashboard/actions'
import type { FamilyMember, Profile } from '@/types/modules'

const ROLE_LABEL: Record<string, string> = {
  titular: 'Titular',
  conjuge: 'Cônjuge',
  filho: 'Filho/a',
  ascendente: 'Ascendente',
  outro: 'Outro',
}

export function DefinicoesView({ profile, members }: { profile: Profile; members: FamilyMember[] }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader title="Definições" description="Conta, membros da família, plano e notificações." />

      <Tabs defaultValue="membros">
        <TabsList>
          <TabsTrigger value="membros">Membros</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="membros">
          <Card>
            <CardContent className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar emoji={m.avatar_emoji} name={m.name} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs text-slate-400">{ROLE_LABEL[m.role] ?? m.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
                + Adicionar membro
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plano">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Plano atual</p>
                  <p className="text-lg font-semibold capitalize text-slate-900">{profile.plan}</p>
                </div>
                <Badge variant="brand">Ativo</Badge>
              </div>
              <Link href="/pricing">
                <Button>Mudar de plano</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardContent className="space-y-3">
              <Toggle label="Alertas de validade de documentos" defaultChecked />
              <Toggle label="Prazos fiscais (IRS, IUC, IMI)" defaultChecked />
              <Toggle label="Resumo semanal por email (segunda-feira)" defaultChecked />
              <Toggle label="Dicas do SAM" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal open={open} onClose={() => setOpen(false)} title="Adicionar membro">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            await addFamilyMember(new FormData(e.currentTarget))
            setSaving(false)
            setOpen(false)
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome" name="name" placeholder="Maria Silva" />
            <Select label="Relação" name="role" defaultValue="filho">
              {Object.entries(ROLE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Select>
            <Input label="Data de nascimento" name="birth_date" type="date" />
            <Input label="NIF (opcional)" name="nif" placeholder="000 000 000" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar membro'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm text-slate-700">
      {label}
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-9 accent-brand-500" />
    </label>
  )
}
