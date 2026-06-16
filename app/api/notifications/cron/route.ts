import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, weeklyDigestHtml, type DigestItem } from '@/lib/email/resend'
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

  // Weekly digest: only sends when RESEND_API_KEY is configured (otherwise no-op).
  let emailsSent = 0
  if (process.env.RESEND_API_KEY && toCreate.length > 0) {
    const byUser = new Map<string, DigestItem[]>()
    for (const n of toCreate) {
      const list = byUser.get(n.user_id) ?? []
      list.push({ title: n.title, detail: n.body ?? '' })
      byUser.set(n.user_id, list)
    }
    for (const [userId, items] of byUser) {
      const [{ data: auth }, { data: profile }] = await Promise.all([
        supabase.auth.admin.getUserById(userId),
        supabase.from('profiles').select('family_name').eq('id', userId).single(),
      ])
      const email = auth?.user?.email
      if (!email) continue
      const result = await sendEmail({
        to: email,
        subject: `🏠 Resumo semanal — ${items.length} ${items.length === 1 ? 'aviso' : 'avisos'}`,
        html: weeklyDigestHtml(profile?.family_name ?? 'A sua família', items),
      })
      if (!('skipped' in result) && !('error' in result)) emailsSent += 1
    }
  }

  return NextResponse.json({ ok: true, created: toCreate.length, emailsSent })
}
