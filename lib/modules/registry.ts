import {
  PieChart,
  Files,
  ReceiptText,
  Car,
  HeartPulse,
  Building2,
  GraduationCap,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'

export type Plan = 'free' | 'base' | 'pro'
export type ModuleColor = 'brand' | 'blue' | 'green' | 'red' | 'rose' | 'purple'

export interface ModuleDef {
  id: string
  name: string
  icon: LucideIcon
  description: string
  route: string
  color: ModuleColor
  plan: Plan
}

export const MODULES: readonly ModuleDef[] = [
  {
    id: 'financas',
    name: 'Finanças Familiares',
    icon: PieChart,
    description: 'Orçamento, despesas, faturas e poupança.',
    route: '/dashboard/financas',
    color: 'brand',
    plan: 'base',
  },
  {
    id: 'documentos',
    name: 'Documentos e Prazos',
    icon: Files,
    description: 'CC, passaporte, carta de condução, seguros.',
    route: '/dashboard/documentos',
    color: 'blue',
    plan: 'base',
  },
  {
    id: 'irs',
    name: 'IRS e e-Fatura',
    icon: ReceiptText,
    description: 'Faturas, deduções e calendário fiscal.',
    route: '/dashboard/irs',
    color: 'green',
    plan: 'base',
  },
  {
    id: 'automovel',
    name: 'Automóvel',
    icon: Car,
    description: 'IUC, seguro, inspeção e revisão.',
    route: '/dashboard/automovel',
    color: 'red',
    plan: 'base',
  },
  {
    id: 'saude',
    name: 'Saúde Familiar',
    icon: HeartPulse,
    description: 'Historial médico, vacinas e medicação.',
    route: '/dashboard/saude',
    color: 'rose',
    plan: 'pro',
  },
  {
    id: 'habitacao',
    name: 'Habitação',
    icon: Building2,
    description: 'Contratos, renda, condomínio, garantias.',
    route: '/dashboard/habitacao',
    color: 'purple',
    plan: 'pro',
  },
  {
    id: 'escola',
    name: 'Escola e Filhos',
    icon: GraduationCap,
    description: 'Propinas, ATL, vacinas, documentos escolares.',
    route: '/dashboard/escola',
    color: 'blue',
    plan: 'pro',
  },
  {
    id: 'sam',
    name: 'SAM — Assistente',
    icon: MessageCircle,
    description: 'Assistente inteligente da Casa Organizada.',
    route: '/dashboard/sam',
    color: 'brand',
    plan: 'base',
  },
] as const

export function getModule(id: string): ModuleDef | undefined {
  return MODULES.find((m) => m.id === id)
}

export function getModuleByRoute(route: string): ModuleDef | undefined {
  return MODULES.find((m) => m.route === route)
}

/** Tailwind class fragments per module colour (kept static so Tailwind can detect them). */
export const MODULE_COLOR_CLASSES: Record<ModuleColor, { text: string; bg: string; ring: string; iconBg: string }> = {
  brand: { text: 'text-brand-600', bg: 'bg-brand-50', ring: 'ring-brand-200', iconBg: 'bg-brand-100 text-brand-700' },
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-200', iconBg: 'bg-blue-100 text-blue-700' },
  green: { text: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200', iconBg: 'bg-green-100 text-green-700' },
  red: { text: 'text-red-600', bg: 'bg-red-50', ring: 'ring-red-200', iconBg: 'bg-red-100 text-red-700' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', ring: 'ring-rose-200', iconBg: 'bg-rose-100 text-rose-700' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-200', iconBg: 'bg-purple-100 text-purple-700' },
}

const PLAN_RANK: Record<Plan, number> = { free: 0, base: 1, pro: 2 }

/** Whether a user on `userPlan` can access a module requiring `required`. */
export function canAccess(userPlan: Plan, required: Plan): boolean {
  return PLAN_RANK[userPlan] >= PLAN_RANK[required]
}
