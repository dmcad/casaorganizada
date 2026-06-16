'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Bell, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-glow">
      <div className="container-content grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Badge variant="brand" className="mb-5">
            🇵🇹 Feito para famílias portuguesas
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            A vida administrativa da sua família, finalmente num só lugar.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            IRS, seguros, documentos, saúde, automóvel, escola — organizado, com alertas automáticos e um
            assistente inteligente chamado SAM.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#sam">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Ver demonstração
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">Sem cartão de crédito.</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand-500" /> Encriptado
            </span>
            <span>🇵🇹 Feito para Portugal</span>
            <span>✓ Conforme RGPD</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-brand-900/10">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-green-400" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
          <div>
            <p className="text-xs font-medium text-brand-700">Dedução IRS estimada</p>
            <p className="tabular text-2xl font-semibold text-brand-800">847,00 €</p>
          </div>
          <ReceiptBadge />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MiniStat label="Saldo do mês" value="+ 1.328 €" tone="text-emerald-600" />
          <MiniStat label="Próximo prazo" value="IUC · 28 fev" tone="text-amber-600" />
        </div>
        <motion.div
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Bell className="mt-0.5 h-4 w-4 text-amber-600" />
          <p className="text-xs text-amber-900">
            <span className="font-semibold">CC da Maria</span> expira em 47 dias.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`tabular text-base font-semibold ${tone}`}>{value}</p>
    </div>
  )
}

function ReceiptBadge() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
      <span className="text-xl">📊</span>
    </div>
  )
}
