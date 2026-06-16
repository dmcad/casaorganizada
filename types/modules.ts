export type Plan = 'free' | 'base' | 'pro'

export interface Profile {
  id: string
  family_name: string
  full_name: string | null
  avatar_url: string | null
  plan: Plan
  plan_expires_at: string | null
}

export interface FamilyMember {
  id: string
  name: string
  role: 'titular' | 'conjuge' | 'filho' | 'ascendente' | 'outro'
  birth_date: string | null
  nif: string | null
  avatar_emoji: string
}

export interface DocumentRecord {
  id: string
  member_id: string | null
  member_name?: string
  module: string
  category: string
  name: string
  issuer: string | null
  issued_at: string | null
  expires_at: string | null
  alert_days: number
  file_url: string | null
  notes: string | null
  metadata: Record<string, unknown>
}

export interface Transaction {
  id: string
  category_id: string | null
  category_name?: string
  amount: number
  type: 'income' | 'expense'
  description: string | null
  merchant: string | null
  date: string
  source: 'manual' | 'ocr' | 'bank_import'
  nif_requested: boolean
  irs_category: string | null
  irs_deduction: number | null
}

export interface BudgetCategory {
  id: string
  name: string
  icon: string | null
  color: string | null
  monthly_limit: number | null
  type: 'income' | 'expense' | 'saving'
  spent?: number
}

export interface Vehicle {
  id: string
  name: string
  plate: string
  brand: string
  iuc_due: string | null
  insurance_due: string | null
  inspection_due: string | null
}

export interface AppNotification {
  id: string
  type: 'document_expiry' | 'irs_deadline' | 'payment_due' | 'sam_tip' | 'budget_alert'
  title: string
  body: string | null
  module: string | null
  read: boolean
  created_at: string
}
