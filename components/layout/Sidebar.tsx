'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, Lock } from 'lucide-react'
import { MODULES } from '@/lib/modules/registry'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types/modules'

const PLAN_RANK: Record<Plan, number> = { free: 0, base: 1, pro: 2 }

export function Sidebar({ plan = 'base' }: { plan?: Plan }) {
  const pathname = usePathname()
  const modules = MODULES.filter((m) => m.id !== 'sam')

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-slate-100 px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <NavItem
          href="/dashboard"
          label="Visão geral"
          icon={<LayoutDashboard className="h-[18px] w-[18px]" />}
          active={pathname === '/dashboard'}
        />

        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Módulos</p>

        {modules.map((m) => {
          const Icon = m.icon
          const locked = PLAN_RANK[plan] < PLAN_RANK[m.plan]
          const active = pathname === m.route
          return (
            <NavItem
              key={m.id}
              href={m.route}
              label={m.name}
              icon={<Icon className="h-[18px] w-[18px]" />}
              active={active}
              locked={locked}
              pro={m.plan === 'pro'}
            />
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <NavItem
          href="/dashboard/definicoes"
          label="Definições"
          icon={<Settings className="h-[18px] w-[18px]" />}
          active={pathname === '/dashboard/definicoes'}
        />
      </div>
    </aside>
  )
}

function NavItem({
  href,
  label,
  icon,
  active,
  locked,
  pro,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active?: boolean
  locked?: boolean
  pro?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
        active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      )}
    >
      <span className={cn(active ? 'text-brand-600' : 'text-slate-400')}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {locked ? (
        <Lock className="h-3.5 w-3.5 text-slate-300" />
      ) : pro ? (
        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
          Pro
        </span>
      ) : null}
    </Link>
  )
}
