import { Card } from '@/components/ui/Card'

const PAINS = [
  { emoji: '🪪', title: 'Carta caducada.', detail: 'Multa de 600€.' },
  { emoji: '🚗', title: 'IUC em fevereiro.', detail: 'Não sabia.' },
  { emoji: '🧾', title: 'Faturas do ginásio sem NIF.', detail: '30€ perdidos no IRS.' },
]

export function Problem() {
  return (
    <section className="container-content py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Cada português gere, em média, +40 documentos, 12 prazos e 8 obrigações fiscais por ano.
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Espalhados por emails, envelopes de papel e memória. É fácil escapar algo — e custa caro.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PAINS.map((p) => (
          <Card key={p.title} className="p-6">
            <div className="text-3xl">{p.emoji}</div>
            <p className="mt-4 text-lg font-semibold text-slate-900">{p.title}</p>
            <p className="mt-1 text-2xl font-semibold text-danger">{p.detail}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}
