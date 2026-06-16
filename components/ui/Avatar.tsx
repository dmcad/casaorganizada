import { cn } from '@/lib/utils'

export interface AvatarProps {
  name?: string
  emoji?: string
  src?: string | null
  className?: string
}

function initials(name?: string) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function Avatar({ name, emoji, src, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-semibold text-brand-700',
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? 'avatar'} className="h-full w-full object-cover" />
      ) : emoji ? (
        <span aria-hidden>{emoji}</span>
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
