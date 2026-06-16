'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { SamChat } from '@/components/sam/SamChat'

export function SamFab() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-4 z-50 flex h-[min(560px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:right-6"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-brand-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <div>
                  <p className="text-sm font-semibold leading-tight">SAM</p>
                  <p className="text-xs leading-tight text-brand-50/80">Assistente da Casa Organizada</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="rounded-lg p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <SamChat compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir assistente SAM"
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-2xl text-white shadow-xl transition-transform hover:scale-105 sm:right-6"
      >
        {!open && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/60" aria-hidden />
        )}
        <span className="relative">{open ? '✕' : '🏠'}</span>
      </button>
    </>
  )
}
