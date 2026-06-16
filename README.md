# Casa Organizada

> A vida da sua casa, finalmente organizada.

Plataforma premium de gestão familiar para Portugal — IRS, documentos, finanças,
automóvel, saúde, habitação e escola, com alertas automáticos e o assistente
inteligente **SAM**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **Supabase** (PostgreSQL + RLS + Storage + Auth)
- **Stripe** (subscrições) · **Resend** (email) · **OpenAI GPT-4o** (SAM + OCR)
- **Vercel** (deploy + Cron)

## Começar

```bash
npm install
cp .env.example .env.local   # preencher as chaves
npm run dev
```

A app abre em `http://localhost:3000`.

> **Modo demonstração:** sem variáveis de ambiente, a aplicação corre com dados
> de exemplo (família Silva). Toda a UI — landing, dashboard, módulos e SAM —
> é navegável sem Supabase, Stripe ou OpenAI. As funcionalidades reais ativam-se
> automaticamente assim que as chaves estiverem configuradas.

## Estrutura

```
app/                  Rotas (landing, pricing, auth, onboarding, dashboard, api)
  api/                sam · ocr · checkout · webhooks/stripe · notifications/cron
  dashboard/          Visão geral + módulos (financas, documentos, irs, ...)
components/
  ui/                 Design system (Button, Card, Modal, Tabs, Input, ...)
  layout/             Sidebar, TopBar, SamFab, MobileNav
  landing/            Secções da landing page
  billing/            PricingCards, UpgradeGate
  sam/                SamChat + respostas de demonstração
lib/
  modules/registry   Registo de módulos
  irs/deductions      Regras de dedução de IRS (PT, 2025)
  sam/                Construtor do system prompt + tools
  ocr/extract         Extração de documentos (GPT-4o Vision)
  supabase/           Clientes browser / server / admin
  billing/plans       Planos e FAQ
  demo/data           Dataset de demonstração
supabase/migrations/  Esquema SQL inicial (tabelas + RLS)
```

## Base de dados

Aplique o esquema em `supabase/migrations/0001_init.sql` no seu projeto Supabase
(SQL Editor ou `supabase db push`). Inclui todas as tabelas, políticas RLS e o
trigger que cria o `profile` no registo.

## Planos

| Plano    | Preço            | Destaque                                  |
| -------- | ---------------- | ----------------------------------------- |
| Gratuito | 0 €              | 1 membro, 5 documentos                    |
| Base     | 4,90 €/mês · 49 €/ano | Finanças, IRS, Automóvel, SAM (50/mês) |
| Pro      | 9,90 €/mês · 99 €/ano | Saúde, Habitação, Escola, SAM ilimitado |

## Estado do build

Foundation completa e funcional em modo demonstração. Integrações externas
(Supabase, Stripe, OpenAI, Resend) estão implementadas e ativam-se via
variáveis de ambiente — ver `.env.example`.

---

© 2026 Casa Organizada — porque a vida da sua família não cabe num envelope.
