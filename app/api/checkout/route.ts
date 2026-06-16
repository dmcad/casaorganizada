import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const PRICE_ENV: Record<string, string | undefined> = {
  base_monthly: process.env.STRIPE_PRICE_BASE_MONTHLY,
  base_annual: process.env.STRIPE_PRICE_BASE_ANNUAL,
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
}

/**
 * Creates a Stripe Checkout session for the chosen plan/interval.
 * Uses the Stripe REST API directly (no SDK dependency).
 */
export async function POST(req: Request) {
  const { plan, interval, email, userId } = (await req.json().catch(() => ({}))) as {
    plan?: 'base' | 'pro'
    interval?: 'monthly' | 'annual'
    email?: string
    userId?: string
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const priceId = PRICE_ENV[`${plan}_${interval}`]

  if (!secret || !priceId) {
    return NextResponse.json(
      { error: 'Stripe não está configurado (chaves/preços em falta).', mode: 'demo' },
      { status: 503 },
    )
  }

  const form = new URLSearchParams()
  form.set('mode', 'subscription')
  form.set('line_items[0][price]', priceId)
  form.set('line_items[0][quantity]', '1')
  form.set('success_url', `${siteUrl}/dashboard?upgraded=true`)
  form.set('cancel_url', `${siteUrl}/pricing`)
  if (email) form.set('customer_email', email)
  if (userId) form.set('metadata[user_id]', userId)
  if (plan) form.set('metadata[plan]', plan)

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })

  const session = await res.json()
  if (!res.ok) {
    return NextResponse.json({ error: session.error?.message ?? 'Erro Stripe.' }, { status: 502 })
  }
  return NextResponse.json({ url: session.url })
}
