import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client for server-only contexts (webhooks, cron, Edge Functions).
 * NEVER import this into client components.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_ADMIN_UNAVAILABLE: service role env não configurado.')
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
