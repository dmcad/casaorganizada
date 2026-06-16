export interface PlanDef {
  id: 'free' | 'base' | 'pro'
  name: string
  tagline: string
  priceMonthly: number
  priceAnnual: number
  highlight?: boolean
  badge?: string
  cta: string
  features: { label: string; included: boolean }[]
}

export const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Gratuito',
    tagline: 'Para começar a organizar.',
    priceMonthly: 0,
    priceAnnual: 0,
    cta: 'Começar grátis',
    features: [
      { label: '1 membro da família', included: true },
      { label: 'Módulo Documentos (até 5)', included: true },
      { label: 'Alertas de validade', included: true },
      { label: 'Funcionalidades financeiras', included: false },
      { label: 'Assistente SAM', included: false },
    ],
  },
  {
    id: 'base',
    name: 'Base',
    tagline: 'Tudo o que a família precisa no dia-a-dia.',
    priceMonthly: 4.9,
    priceAnnual: 49,
    cta: 'Escolher Base',
    features: [
      { label: 'Até 3 membros da família', included: true },
      { label: 'Finanças Familiares (orçamento + despesas)', included: true },
      { label: 'Documentos ilimitados + alertas', included: true },
      { label: 'IRS e e-Fatura (análise automática)', included: true },
      { label: 'Automóvel (1 veículo)', included: true },
      { label: 'SAM — 50 mensagens/mês', included: true },
      { label: 'Upload e OCR (20/mês)', included: true },
      { label: 'Alertas por email', included: true },
      { label: 'Módulos Pro (Saúde, Habitação, Escola)', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para famílias que querem tudo automatizado.',
    priceMonthly: 9.9,
    priceAnnual: 99,
    highlight: true,
    badge: 'Mais popular',
    cta: 'Escolher Pro',
    features: [
      { label: 'Tudo o que está no Base', included: true },
      { label: 'Membros ilimitados', included: true },
      { label: 'Módulo Saúde Familiar', included: true },
      { label: 'Módulo Habitação', included: true },
      { label: 'Módulo Escola e Filhos', included: true },
      { label: 'SAM ilimitado', included: true },
      { label: 'Upload e OCR ilimitado', included: true },
      { label: 'Relatórios exportáveis (PDF)', included: true },
      { label: 'Comparador de seguros', included: true },
      { label: 'Sincronização e-Fatura automática', included: true },
      { label: 'Suporte prioritário', included: true },
    ],
  },
]

export const PRICING_FAQ = [
  {
    q: 'Preciso de cartão de crédito para começar?',
    a: 'Não. O plano Gratuito é grátis para sempre e não pede dados de pagamento. Pode subir de plano quando quiser.',
  },
  {
    q: 'Os meus documentos ficam seguros?',
    a: 'Sim. Tudo é encriptado e os documentos enviados para análise são eliminados após a extração dos dados. Cumprimos o RGPD.',
  },
  {
    q: 'O que é o SAM?',
    a: 'O SAM é o assistente inteligente da Casa Organizada. Conhece os seus prazos, faturas e documentos e responde em português de Portugal.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. A subscrição é mensal ou anual e pode cancelar quando quiser — mantém o acesso até ao fim do período pago.',
  },
  {
    q: 'A análise de IRS substitui um contabilista?',
    a: 'Não. Ajudamos a organizar faturas e a estimar deduções, mas para decisões fiscais recomendamos sempre um TOC.',
  },
  {
    q: 'O plano anual tem desconto?',
    a: 'Sim. Ao escolher o pagamento anual poupa o equivalente a 2 meses face ao plano mensal.',
  },
]
