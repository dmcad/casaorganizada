import Link from 'next/link'
import { Lock, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getModule } from '@/lib/modules/registry'

/**
 * Shown in place of a Pro module when the user is not on the Pro plan.
 */
export function UpgradeGate({ moduleId }: { moduleId: string }) {
  const mod = getModule(moduleId)
  const perks = [
    'Módulos Saúde, Habitação e Escola',
    'Membros ilimitados',
    'SAM ilimitado + OCR ilimitado',
    'Relatórios PDF e comparador de seguros',
  ]
  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
        <Lock className="h-6 w-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        {mod ? `${mod.name} é um módulo Pro` : 'Funcionalidade Pro'}
      </h1>
      <p className="mt-2 text-slate-600">
        Faça upgrade para o plano Pro e desbloqueie tudo o que a sua família precisa.
      </p>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
        {perks.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-slate-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/pricing">
          <Button size="lg">Ver planos</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="secondary">
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  )
}
