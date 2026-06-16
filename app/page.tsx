import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { ModulesShowcase } from '@/components/landing/ModulesShowcase'
import { SamSection } from '@/components/landing/SamSection'
import { IRSCalculator } from '@/components/landing/IRSCalculator'
import { Trust } from '@/components/landing/Trust'
import { Footer } from '@/components/landing/Footer'
import { PricingCards } from '@/components/billing/PricingCards'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <ModulesShowcase />
        <SamSection />
        <IRSCalculator />

        <section id="precos" className="bg-slate-50 py-16 sm:py-24">
          <div className="container-content">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Preços simples e justos.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Comece grátis. Suba de plano quando a sua família precisar.
              </p>
            </div>
            <div className="mt-12">
              <PricingCards />
            </div>
          </div>
        </section>

        <Trust />
      </main>
      <Footer />
    </>
  )
}
