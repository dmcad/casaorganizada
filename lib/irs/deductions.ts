/**
 * Portuguese IRS deduction rules (tax year 2025, declared in 2026).
 * Rates and ceilings reflect the IRS "deduções à coleta" framework.
 * This is informational and not tax advice — for decisions, consult a TOC.
 */

export interface DeductionRule {
  rate: number
  max_deduction: number
  includes: string[]
  requires_nif?: boolean
  can_add_manually?: boolean
  [key: string]: unknown
}

export const IRS_RULES_2025 = {
  saude: {
    rate: 0.15,
    max_deduction: 1000,
    includes: ['consultas', 'medicamentos', 'seguros_saude', 'oculos', 'proteses', 'fisioterapia'],
    requires_nif: true,
    can_add_manually: true,
  },
  educacao: {
    rate: 0.3,
    max_deduction: 800,
    max_deduction_student_displaced: 1100,
    includes: ['propinas', 'creche', 'ati', 'manuais', 'explicacoes', 'refeicoes_escolares'],
    requires_nif: true,
    can_add_manually: true,
  },
  habitacao_renda: {
    rate: 0.15,
    max_deduction: 700, // rises to 900 in 2027
    includes: ['renda_habitacao_permanente'],
    requires_at_contract: true,
    can_add_manually: true,
  },
  geral: {
    rate: 0.35,
    rate_monoparental: 0.45,
    max_deduction: 250, // per taxpayer
    max_deduction_joint: 500,
    max_deduction_monoparental: 335,
    includes: ['supermercado', 'vestuario', 'combustivel', 'agua', 'luz', 'gas', 'telecomunicacoes'],
    requires_nif: true,
  },
  iva_beneficio: {
    rate_15: 0.15, // restauração, cabeleireiro, mecânico, veterinário, teatro, museus
    rate_30: 0.3, // ginásio, atividade física
    rate_35: 0.35, // medicamentos veterinários
    rate_100: 1.0, // transportes públicos, jornais/revistas a taxa reduzida
    max_deduction: 250,
    requires_nif: true,
    can_add_manually: false, // CRÍTICO: não pode ser adicionado manualmente na declaração
  },
  lares: {
    rate: 0.25,
    max_deduction: 296, // por pessoa em lar
    includes: ['lares_idosos', 'residencias_assistidas'],
    can_add_manually: true,
  },
} as const

export type IrsCategory = keyof typeof IRS_RULES_2025

export const IRS_CATEGORY_LABELS: Record<IrsCategory, string> = {
  saude: 'Saúde',
  educacao: 'Educação',
  habitacao_renda: 'Habitação (renda)',
  geral: 'Despesas gerais familiares',
  iva_beneficio: 'IVA — benefício em fatura',
  lares: 'Lares',
}

export const IRS_CALENDAR = [
  { key: 'efatura_validation', date: '2026-02-28', label: 'Validar faturas no e-Fatura', critical: true },
  { key: 'deducoes_disponiveis', date: '2026-03-15', label: 'Página de deduções AT disponível', critical: false },
  { key: 'deducoes_confirmacao', date: '2026-03-31', label: 'Confirmar valores AT', critical: true },
  { key: 'irs_entrega', date: '2026-04-01', label: 'Início entrega IRS (Modelo 3)', critical: true },
  { key: 'irs_prazo', date: '2026-06-30', label: 'Prazo final entrega IRS', critical: true },
] as const

export const PT_FISCAL_CALENDAR = [
  { key: 'iuc', month: 2, label: 'IUC — prazo único fevereiro (novo 2026)', module: 'automovel' },
  { key: 'imi_1', month: 4, label: 'IMI — 1.ª prestação (valor > 500€)', module: 'habitacao' },
  { key: 'imi_2', month: 7, label: 'IMI — 2.ª prestação (valor > 500€)', module: 'habitacao' },
  { key: 'imi_3', month: 11, label: 'IMI — 3.ª prestação (ou pagamento único até €500)', module: 'habitacao' },
] as const

/**
 * Compute the capped deduction for an amount in a given simple category.
 * Returns both the raw and capped deduction so the UI can show "perdido por limite".
 */
export function computeDeduction(category: IrsCategory, amountSpent: number) {
  const rule = IRS_RULES_2025[category]
  const rate = 'rate' in rule ? (rule.rate as number) : (rule as { rate_15: number }).rate_15
  const max = rule.max_deduction
  const raw = amountSpent * rate
  const capped = Math.min(raw, max)
  return {
    rate,
    amountSpent,
    rawDeduction: round2(raw),
    deduction: round2(capped),
    max,
    capReached: raw > max,
    lostToCap: round2(Math.max(0, raw - max)),
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}
