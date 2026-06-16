'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthedUser } from '@/lib/data/queries'

export async function signOut() {
  const { supabase } = await getAuthedUser()
  if (supabase) await supabase.auth.signOut()
  redirect('/')
}

export interface ActionResult {
  ok: boolean
  demo?: boolean
  error?: string
}

function str(form: FormData, key: string): string | null {
  const v = form.get(key)
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : null
}
function num(form: FormData, key: string): number | null {
  const v = str(form, key)
  if (v === null) return null
  const n = Number(v.replace(',', '.'))
  return Number.isFinite(n) ? n : null
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** Returns the value only if it's a UUID, else null (guards against demo ids). */
function uuid(form: FormData, key: string): string | null {
  const v = str(form, key)
  return v && UUID_RE.test(v) ? v : null
}

export async function createDocument(form: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return { ok: true, demo: true }

  const { error } = await supabase.from('documents').insert({
    user_id: user.id,
    member_id: uuid(form, 'member_id'),
    module: str(form, 'module') ?? 'documentos',
    category: str(form, 'category') ?? 'outro',
    name: str(form, 'name') ?? 'Documento',
    issuer: str(form, 'issuer'),
    issued_at: str(form, 'issued_at'),
    expires_at: str(form, 'expires_at'),
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/documentos')
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function createTransaction(form: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return { ok: true, demo: true }

  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    category_id: uuid(form, 'category_id'),
    amount: num(form, 'amount') ?? 0,
    type: str(form, 'type') ?? 'expense',
    description: str(form, 'description'),
    merchant: str(form, 'merchant'),
    date: str(form, 'date') ?? new Date().toISOString().slice(0, 10),
    nif_requested: form.get('nif_requested') === 'on',
    irs_category: str(form, 'irs_category'),
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/financas')
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function addFamilyMember(form: FormData): Promise<ActionResult> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return { ok: true, demo: true }

  const { error } = await supabase.from('family_members').insert({
    user_id: user.id,
    name: str(form, 'name') ?? 'Membro',
    role: str(form, 'role') ?? 'outro',
    birth_date: str(form, 'birth_date'),
    nif: str(form, 'nif'),
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard/definicoes')
  return { ok: true }
}

export async function markNotificationsRead(): Promise<ActionResult> {
  const { supabase, user } = await getAuthedUser()
  if (!supabase || !user) return { ok: true, demo: true }
  const { error } = await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard')
  return { ok: true }
}
