'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Bell, Search, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { markNotificationsRead, signOut } from '@/app/dashboard/actions'
import type { AppNotification, Profile } from '@/types/modules'

export function TopBar({
  profile,
  notifications,
}: {
  profile: Profile
  notifications: AppNotification[]
}) {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [items, setItems] = useState(notifications)
  const [, startTransition] = useTransition()
  const unread = items.filter((n) => !n.read).length

  function toggle() {
    const opening = !open
    setOpen(opening)
    if (opening && unread > 0) {
      // Optimistically mark read; persist when Supabase is configured.
      setItems((prev) => prev.map((n) => ({ ...n, read: true })))
      startTransition(() => {
        void markNotificationsRead()
      })
    }
  }

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
            onClick={toggle}
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
                  <Badge variant="muted">{items.length}</Badge>
                </div>
                <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                  {items.length === 0 ? (
                    <p className="p-6 text-center text-sm text-slate-400">Sem notificações.</p>
                  ) : (
                    items.map((n) => (
                      <div key={n.id} className="flex gap-3 p-4">
                        <span className="mt-0.5 text-lg">
                          {n.type === 'sam_tip' ? '🏠' : n.type === 'payment_due' ? '💶' : '🔔'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{n.title}</p>
                          {n.body && <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setMenu((m) => !m)}
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-slate-100"
          >
            <Avatar name={profile.full_name ?? profile.family_name} src={profile.avatar_url} />
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900">Família {profile.family_name}</p>
              <p className="text-xs capitalize leading-tight text-slate-400">Plano {profile.plan}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl">
                <Link
                  href="/dashboard/definicoes"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 text-slate-400" /> Definições
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 text-slate-400" /> Terminar sessão
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
