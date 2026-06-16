import * as React from 'react'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50'

interface FieldWrapProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

export function Field({ label, error, hint, required, children }: FieldWrapProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <Field label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        className={cn(fieldBase, error && 'border-danger focus:border-danger focus:ring-danger/30', className)}
        {...props}
      />
    </Field>
  ),
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <Field label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        className={cn(fieldBase, 'min-h-[88px] resize-y', error && 'border-danger', className)}
        {...props}
      />
    </Field>
  ),
)
Textarea.displayName = 'Textarea'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, required, children, ...props }, ref) => (
    <Field label={label} error={error} hint={hint} required={required}>
      <select ref={ref} className={cn(fieldBase, 'cursor-pointer', error && 'border-danger', className)} {...props}>
        {children}
      </select>
    </Field>
  ),
)
Select.displayName = 'Select'
