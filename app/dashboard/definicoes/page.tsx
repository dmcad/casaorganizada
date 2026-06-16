'use client'

import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { DEMO_MEMBERS, DEMO_PROFILE } from '@/lib/demo/data'

export default function DefinicoesPage() {
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
              {DEMO_MEMBERS.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar emoji={m.avatar_emoji} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{m.name}</p>
                      <p className="text-xs capitalize text-slate-400">{m.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="sm">
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
                  <p className="text-lg font-semibold capitalize text-slate-900">{DEMO_PROFILE.plan}</p>
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
