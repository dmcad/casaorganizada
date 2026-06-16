import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2', className)}>
      <span className="text-xl" aria-hidden>
        🏠
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-slate-900">
        Casa Organizada
      </span>
    </Link>
  )
}
