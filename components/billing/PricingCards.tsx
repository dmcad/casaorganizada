'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { PLANS } from '@/lib/billing/plans'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatEuro } from '@/lib/utils'

export function PricingCards() {
  const router = useRouter()
  const [annual, setAnnual] = useState(true)
  const [loading, setLoading] = useState<string | null>(null)

  async function choosePlan(planId: 'free' | 'base' | 'pro') {
    if (planId === 'free') {
      router.push('/auth/register')
      return
    }
    setLoading(planId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval: annual ? 'annual' : 'monthly' }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      // Demo mode / Stripe not configured — start with sign-up.
      router.push('/auth/register')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={cn('text-sm font-medium', !annual ? 'text-slate-900' : 'text-slate-400')}>Mensal</span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((a) => !a)}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            annual ? 'bg-brand-500' : 'bg-slate-300',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              annual ? 'translate-x-5' : 'translate-x-0.5',
            )}
          />
        </button>
        <span className={cn('text-sm font-medium', annual ? 'text-slate-900' : 'text-slate-400')}>
          Anual
        </span>
        <Badge variant="success">Poupa 2 meses</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = annual ? plan.priceAnnual : plan.priceMonthly
          const period = plan.id === 'free' ? '' : annual ? '/ano' : '/mês'
          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm',
                plan.highlight ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-200',
              )}
            >
              {plan.badge && (
                <Badge variant="brand" className="absolute -top-3 left-6">
                  {plan.badge}
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="tabular text-4xl font-semibold text-slate-900">
                  {plan.id === 'free' ? 'Grátis' : formatEuro(price)}
                </span>
                {period && <span className="text-sm text-slate-400">{period}</span>}
              </div>
              {annual && plan.id !== 'free' && (
                <p className="mt-1 text-xs text-brand-600">2 meses grátis incluídos</p>
              )}

              <Button
                variant={plan.highlight ? 'primary' : 'secondary'}
                className="mt-6 w-full"
                onClick={() => choosePlan(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? 'A processar…' : plan.cta}
              </Button>

              <ul className="mt-6 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                    )}
                    <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
