import * as React from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

const config: Record<AlertVariant, { wrap: string; icon: React.ElementType }> = {
  info: { wrap: 'bg-blue-50 text-blue-800 border-blue-200', icon: Info },
  success: { wrap: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  warning: { wrap: 'bg-amber-50 text-amber-900 border-amber-200', icon: AlertTriangle },
  danger: { wrap: 'bg-red-50 text-red-800 border-red-200', icon: XCircle },
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
}

export function Alert({ variant = 'info', title, children, className, ...props }: AlertProps) {
  const { wrap, icon: Icon } = config[variant]
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4 text-sm', wrap, className)} {...props}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed opacity-90">{children}</div>}
      </div>
    </div>
  )
}
