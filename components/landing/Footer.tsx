import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-content flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden>🏠</span>
            <span className="font-display font-semibold text-slate-900">Casa Organizada</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Porque a vida da sua família não cabe num envelope.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
          <Link href="/pricing" className="hover:text-slate-900">
            Preços
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Privacidade
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Termos
          </Link>
          <Link href="#" className="hover:text-slate-900">
            Contacto
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4">
        <p className="container-content text-xs text-slate-400">© 2026 Casa Organizada. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
