'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all',
        scrolled ? 'border-b border-slate-200 bg-white/80 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <nav className="container-content flex h-16 items-center justify-between">
        <Logo />
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#funcionalidades" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Funcionalidades
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Preços
          </Link>
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/register">
            <Button size="sm">Começar grátis</Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
