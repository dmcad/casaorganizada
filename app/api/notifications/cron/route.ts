import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { daysUntil } from '@/lib/utils'

export const runtime = 'nodejs'

/**
 * Daily cron (Vercel Cron) that scans documents for upcoming expiries and
 * inserts notifications. Protected by CRON_SECRET when configured.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    return NextResponse.json({ ok: true, mode: 'demo', created: 0 })
  }

  const { data: documents, error } = await supabase
    .from('documents')
    .select('id, user_id, name, expires_at, alert_days, module, member_id')
    .not('expires_at', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const toCreate = (documents ?? [])
    .map((d) => ({ d, days: daysUntil(d.expires_at) }))
    .filter(({ d, days }) => days !== null && days >= 0 && days <= (d.alert_days ?? 90))
    .map(({ d, days }) => ({
      user_id: d.user_id,
      type: 'document_expiry',
      title: `${d.name} expira em ${days} dias`,
      body: 'Renove a tempo para evitar problemas.',
      document_id: d.id,
      module: d.module,
      scheduled_for: new Date().toISOString(),
    }))

  if (toCreate.length > 0) {
    await supabase.from('notifications').insert(toCreate)
  }

  return NextResponse.json({ ok: true, created: toCreate.length })
}
