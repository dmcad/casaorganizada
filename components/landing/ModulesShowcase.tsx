'use client'

import { motion } from 'framer-motion'
import { MODULES, MODULE_COLOR_CLASSES } from '@/lib/modules/registry'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
}
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

export function ModulesShowcase() {
  const modules = MODULES.filter((m) => m.id !== 'sam')

  return (
    <section id="funcionalidades" className="bg-white py-16 sm:py-24">
      <div className="container-content">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Módulos
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tudo o que a sua casa precisa, num só sítio.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Ative apenas os módulos que precisa. Cada um remove uma tarefa que hoje faz à mão.
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {modules.map((m) => {
            const Icon = m.icon
            const colors = MODULE_COLOR_CLASSES[m.color]
            return (
              <motion.div
                key={m.id}
                variants={item}
                className={cn(
                  'group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all',
                  'hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colors.iconBg)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={m.plan === 'pro' ? 'warning' : 'muted'}>
                    {m.plan === 'pro' ? 'Pro' : 'Base'}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{m.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{m.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
