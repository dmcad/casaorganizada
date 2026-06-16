import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

/**
 * Verifies a Stripe webhook signature (v1 scheme) without the Stripe SDK.
 * Returns the parsed event on success, or null on failure.
 */
function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header) return null
  const parts = Object.fromEntries(header.split(',').map((kv) => kv.split('=')))
  const timestamp = parts['t']
  const signature = parts['v1']
  if (!timestamp || !signature) return null

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`, 'utf8')
    .digest('hex')

  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

  return JSON.parse(payload)
}

const PLAN_FROM_PRICE: Record<string, 'base' | 'pro'> = {
  [process.env.STRIPE_PRICE_BASE_MONTHLY ?? '_bm']: 'base',
  [process.env.STRIPE_PRICE_BASE_ANNUAL ?? '_ba']: 'base',
  [process.env.STRIPE_PRICE_PRO_MONTHLY ?? '_pm']: 'pro',
  [process.env.STRIPE_PRICE_PRO_ANNUAL ?? '_pa']: 'pro',
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ received: true, mode: 'demo' })
  }

  const payload = await req.text()
  const event = verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret)
  if (!event) {
    return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 400 })
  }

  let supabase
  try {
    supabase = createAdminClient()
  } catch {
    return NextResponse.json({ received: true, mode: 'no-db' })
  }

  // Idempotency: record the event id.
  await supabase.from('subscription_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    payload: event,
  })

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan ?? 'base'
      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          })
          .eq('id', userId)
      }
      break
    }
    case 'customer.subscription.updated': {
      const sub = event.data.object
      const priceId = sub.items?.data?.[0]?.price?.id
      const plan = PLAN_FROM_PRICE[priceId] ?? 'base'
      await supabase
        .from('profiles')
        .update({ plan, plan_expires_at: new Date(sub.current_period_end * 1000).toISOString() })
        .eq('stripe_subscription_id', sub.id)
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      await supabase.from('profiles').update({ plan: 'free' }).eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
