'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { Progress } from '@/components/ui/Progress'
import { PLANS } from '@/lib/billing/plans'
import { cn } from '@/lib/utils'

const STEPS = ['Família', 'Membros', 'Documento', 'SAM'] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else finish()
  }

  function finish() {
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1600)
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-glow">
      <div className="container-content flex items-center justify-between py-6">
        <Logo />
        <button onClick={finish} className="text-sm text-slate-400 hover:text-slate-600">
          Saltar
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6" />
          <div className="mb-6 flex justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                    i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-400',
                  )}
                >
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn('hidden sm:inline', i === step ? 'font-medium text-slate-900' : 'text-slate-400')}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {done ? (
              <Celebration />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === 0 && <StepFamily />}
                  {step === 1 && <StepMembers />}
                  {step === 2 && <StepDocument />}
                  {step === 3 && <StepSam />}
                </motion.div>
              </AnimatePresence>
            )}

            {!done && (
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Anterior
                </Button>
                <Button onClick={next}>
                  {step === STEPS.length - 1 ? 'Concluir' : 'Continuar'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepFamily() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Vamos começar</h2>
        <p className="mt-1 text-sm text-slate-500">Como se chama a sua família e que plano quer experimentar?</p>
      </div>
      <Input label="Nome da família" defaultValue="Silva" />
      <Select label="Plano" defaultValue="base">
        {PLANS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>
    </div>
  )
}

function StepMembers() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Quem faz parte do agregado?</h2>
        <p className="mt-1 text-sm text-slate-500">Adicione os membros da família. Pode editar mais tarde.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Nome" defaultValue="João Silva" />
        <Select label="Relação" defaultValue="titular">
          <option value="titular">Titular</option>
          <option value="conjuge">Cônjuge</option>
          <option value="filho">Filho/a</option>
          <option value="ascendente">Ascendente</option>
        </Select>
        <Input label="Data de nascimento" type="date" />
        <Input label="NIF (opcional)" placeholder="000 000 000" />
      </div>
      <Button variant="secondary" size="sm">
        + Adicionar outro membro
      </Button>
    </div>
  )
}

function StepDocument() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Adicione o primeiro documento</h2>
        <p className="mt-1 text-sm text-slate-500">Um Cartão de Cidadão ou passaporte — o SAM trata do resto.</p>
      </div>
      <FileUpload />
    </div>
  )
}

function StepSam() {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-3xl">🏠</div>
      <h2 className="text-xl font-semibold text-slate-900">Olá! Sou o SAM.</h2>
      <p className="mx-auto max-w-sm text-sm text-slate-600">
        Já vi que o <strong>João</strong> tem o CC a expirar em agosto. Quer que o avise com antecedência?
      </p>
      <div className="flex justify-center gap-2">
        <Button size="sm">Sim, avisa-me</Button>
        <Button size="sm" variant="secondary">
          Mais tarde
        </Button>
      </div>
    </div>
  )
}

function Celebration() {
  return (
    <div className="py-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white"
      >
        <Sparkles className="h-8 w-8" />
      </motion.div>
      <h2 className="mt-4 text-xl font-semibold text-slate-900">Tudo a postos! 🎉</h2>
      <p className="mt-1 text-sm text-slate-500">A levar-te para o teu painel…</p>
    </div>
  )
}
