'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { IRS_RULES_2025 } from '@/lib/irs/deductions'
import { formatEuro } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

function Slider({
  label,
  value,
  onChange,
  max,
  emoji,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  max: number
  emoji: string
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          {emoji} {label}
        </span>
        <span className="tabular text-sm font-semibold text-slate-900">{formatEuro(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-500"
        aria-label={label}
      />
    </div>
  )
}

export function IRSCalculator() {
  const [saude, setSaude] = useState(800)
  const [educacao, setEducacao] = useState(600)
  const [geral, setGeral] = useState(4000)

  const total = useMemo(() => {
    const dSaude = Math.min(saude * IRS_RULES_2025.saude.rate, IRS_RULES_2025.saude.max_deduction)
    const dEdu = Math.min(educacao * IRS_RULES_2025.educacao.rate, IRS_RULES_2025.educacao.max_deduction)
    const dGeral = Math.min(geral * IRS_RULES_2025.geral.rate, IRS_RULES_2025.geral.max_deduction)
    return dSaude + dEdu + dGeral
  }, [saude, educacao, geral])

  return (
    <section className="container-content py-16 sm:py-24">
      <div className="mx-auto grid max-w-4xl gap-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Vê quanto podes recuperar este ano no IRS.
            </h2>
            <p className="mt-2 text-slate-600">Ajusta as tuas despesas e vê a estimativa de dedução em tempo real.</p>
          </div>
          <Slider label="Despesas de saúde" value={saude} onChange={setSaude} max={5000} emoji="💊" />
          <Slider label="Educação" value={educacao} onChange={setEducacao} max={5000} emoji="🎓" />
          <Slider label="Despesas gerais familiares" value={geral} onChange={setGeral} max={12000} emoji="🛒" />
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-50 p-8 text-center">
          <p className="text-sm font-medium text-brand-700">Dedução estimada</p>
          <p className="tabular mt-2 text-5xl font-semibold text-brand-800">{formatEuro(total)}</p>
          <p className="mt-2 text-xs text-brand-700/70">Estimativa indicativa. Não substitui aconselhamento de um TOC.</p>
          <Link href="/auth/register" className="mt-6 w-full">
            <Button className="w-full">Ver análise completa</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
