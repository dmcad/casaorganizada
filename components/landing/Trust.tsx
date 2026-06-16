import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'

const TESTIMONIALS = [
  {
    name: 'Sofia Marques',
    context: 'Mãe de 2, Porto',
    quote: 'Recuperei 230€ no IRS que tinha perdido nos anos anteriores. O SAM avisou-me das faturas sem NIF.',
  },
  {
    name: 'Ricardo Tavares',
    context: 'Lisboa',
    quote: 'Nunca mais me esqueci do IUC nem da inspeção. Os alertas chegam com antecedência.',
  },
  {
    name: 'Helena e Pedro',
    context: 'Braga',
    quote: 'Toda a papelada da família num só sítio. A renovação do CC apareceu antes de ser tarde.',
  },
]

export function Trust() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-content">
        <p className="text-center text-sm font-medium text-slate-500">
          🔒 Conforme RGPD · Encriptado ponta-a-ponta · Documentos eliminados após análise
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <p className="text-sm leading-relaxed text-slate-700">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <Avatar name={t.name} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.context}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400">
          <span>Compatível com:</span>
          <span className="font-semibold text-slate-500">AT — Autoridade Tributária</span>
          <span className="font-semibold text-slate-500">IMT</span>
          <span className="font-semibold text-slate-500">SNS</span>
        </div>
      </div>
    </section>
  )
}
