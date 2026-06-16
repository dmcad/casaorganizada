import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number as euros: €1.234,56 (Portuguese convention). */
export function formatEuro(value: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

/** Format a date as DD/MM/YYYY. */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/** Whole days from today until a given date (negative if past). */
export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

/** Human-friendly relative deadline label in European Portuguese. */
export function deadlineLabel(date: string | Date | null | undefined): string {
  const days = daysUntil(date)
  if (days === null) return '—'
  if (days < 0) return `Expirou há ${Math.abs(days)} dias`
  if (days === 0) return 'Expira hoje'
  if (days === 1) return 'Expira amanhã'
  return `Expira em ${days} dias`
}
