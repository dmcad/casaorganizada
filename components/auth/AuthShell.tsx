import Link from 'next/link'
import { Logo } from '@/components/Logo'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-glow">
      <div className="container-content py-6">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
      <footer className="container-content py-6 text-center text-xs text-slate-400">
        <Link href="#" className="hover:text-slate-600">
          Privacidade
        </Link>
        {' · '}
        <Link href="#" className="hover:text-slate-600">
          Termos
        </Link>
      </footer>
    </div>
  )
}
