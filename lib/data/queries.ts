import 'server-only'
import { createClient } from '@/lib/supabase/server'
import {
  DEMO_BUDGET,
  DEMO_DOCUMENTS,
  DEMO_MEMBERS,
  DEMO_NOTIFICATIONS,
  DEMO_PROFILE,
  DEMO_TRANSACTIONS,
  DEMO_VEHICLES,
} from '@/lib/demo/data'
import type {
  AppNotification,
  BudgetCategory,
  DocumentRecord,
  FamilyMember,
  Profile,
  Transaction,
  Vehicle,
} from '@/types/modules'

/**
 * Returns the authenticated Supabase user, or null when unauthenticated or
 * when Supabase is not configured (demo mode).
 */
export async function getAuthedUser() {
  const supabase = createClient()
  if (!supabase) return { supabase: null, user: null } as const
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user } as const
}

export async function getProfile(): Promise<Profile> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_PROFILE
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (data as Profile) ?? DEMO_PROFILE
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_MEMBERS
  const { data } = await supabase.from('family_members').select('*').eq('user_id', user.id).order('created_at')
  return (data as FamilyMember[]) ?? []
}

export async function getDocuments(): Promise<DocumentRecord[]> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_DOCUMENTS
  const { data } = await supabase
    .from('documents')
    .select('*, family_members(name)')
    .eq('user_id', user.id)
    .order('expires_at', { nullsFirst: false })
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...(row as unknown as DocumentRecord),
    member_name: (row.family_members as { name?: string } | null)?.name,
  }))
}

export async function getTransactions(limit = 50): Promise<Transaction[]> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_TRANSACTIONS
  const { data } = await supabase
    .from('transactions')
    .select('*, budget_categories(name)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit)
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...(row as unknown as Transaction),
    category_name: (row.budget_categories as { name?: string } | null)?.name,
  }))
}

export async function getBudgetCategories(): Promise<BudgetCategory[]> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_BUDGET
  const { data } = await supabase
    .from('budget_categories')
    .select('*')
    .eq('user_id', user.id)
    .order('sort_order')
  return (data as BudgetCategory[]) ?? []
}

export async function getNotifications(): Promise<AppNotification[]> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return DEMO_NOTIFICATIONS
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)
  return (data as AppNotification[]) ?? []
}

/** Vehicles are modelled as automóvel documents; demo data is used for now. */
export async function getVehicles(): Promise<Vehicle[]> {
  return DEMO_VEHICLES
}

export async function getDashboardData() {
  const [profile, members, documents, transactions, budget, notifications] = await Promise.all([
    getProfile(),
    getFamilyMembers(),
    getDocuments(),
    getTransactions(),
    getBudgetCategories(),
    getNotifications(),
  ])
  return { profile, members, documents, transactions, budget, notifications }
}
