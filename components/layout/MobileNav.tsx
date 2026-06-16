'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PieChart, Files, ReceiptText, Car } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/financas', label: 'Finanças', icon: PieChart },
  { href: '/dashboard/documentos', label: 'Docs', icon: Files },
  { href: '/dashboard/irs', label: 'IRS', icon: ReceiptText },
  { href: '/dashboard/automovel', label: 'Auto', icon: Car },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
      {ITEMS.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              active ? 'text-brand-600' : 'text-slate-400',
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
