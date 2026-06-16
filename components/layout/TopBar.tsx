'use client'

import { useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { DEMO_NOTIFICATIONS, DEMO_PROFILE } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

export function TopBar() {
  const [open, setOpen] = useState(false)
  const unread = DEMO_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="relative hidden max-w-sm flex-1 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
        <input
          placeholder="Procurar documentos, faturas, prazos…"
          className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Notificações</p>
                  <Badge variant="brand">{unread} novas</Badge>
                </div>
                <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                  {DEMO_NOTIFICATIONS.map((n) => (
                    <div key={n.id} className={cn('flex gap-3 p-4', !n.read && 'bg-brand-50/40')}>
                      <span className="mt-0.5 text-lg">
                        {n.type === 'sam_tip' ? '🏠' : n.type === 'payment_due' ? '💶' : '🔔'}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{n.title}</p>
                        {n.body && <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100">
          <Avatar name={DEMO_PROFILE.full_name ?? DEMO_PROFILE.family_name} />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-slate-900">Família {DEMO_PROFILE.family_name}</p>
            <p className="text-xs capitalize leading-tight text-slate-400">Plano {DEMO_PROFILE.plan}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
