import type { Metadata } from 'next'
import { Nav } from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import { PricingCards } from '@/components/billing/PricingCards'
import { PRICING_FAQ } from '@/lib/billing/plans'

export const metadata: Metadata = {
  title: 'Preços',
  description: 'Planos simples e justos para organizar a vida da sua família.',
}

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="container-content py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            Escolha o plano da sua família.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Sem compromissos. Cancele quando quiser. O plano Gratuito é para sempre.
          </p>
        </div>

        <div className="mt-12">
          <PricingCards />
        </div>

        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900">
            Perguntas frequentes
          </h2>
          <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {PRICING_FAQ.map((item) => (
              <details key={item.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-900">
                  {item.q}
                  <span className="ml-4 text-slate-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
