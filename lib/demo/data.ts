import type {
  AppNotification,
  BudgetCategory,
  DocumentRecord,
  FamilyMember,
  Profile,
  Transaction,
  Vehicle,
} from '@/types/modules'

/**
 * Demo dataset for the "família Silva". Used to render the product end-to-end
 * before Supabase is wired. Dates are relative to keep the demo evergreen.
 */
function inDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  family_name: 'Silva',
  full_name: 'João Silva',
  avatar_url: null,
  plan: 'base',
  plan_expires_at: null,
}

export const DEMO_MEMBERS: FamilyMember[] = [
  { id: 'm1', name: 'João Silva', role: 'titular', birth_date: '1988-04-12', nif: '••• ••• •12', avatar_emoji: '👨' },
  { id: 'm2', name: 'Maria Silva', role: 'conjuge', birth_date: '1990-09-03', nif: '••• ••• •34', avatar_emoji: '👩' },
  { id: 'm3', name: 'Tomás Silva', role: 'filho', birth_date: '2015-01-22', nif: '••• ••• •56', avatar_emoji: '🧒' },
  { id: 'm4', name: 'Ana Silva', role: 'filho', birth_date: '2018-06-30', nif: null, avatar_emoji: '👧' },
]

export const DEMO_DOCUMENTS: DocumentRecord[] = [
  { id: 'd1', member_id: 'm2', member_name: 'Maria Silva', module: 'documentos', category: 'cc', name: 'Cartão de Cidadão', issuer: 'IRN', issued_at: '2016-08-01', expires_at: inDays(47), alert_days: 90, file_url: null, notes: null, metadata: {} },
  { id: 'd2', member_id: 'm1', member_name: 'João Silva', module: 'documentos', category: 'carta', name: 'Carta de Condução', issuer: 'IMT', issued_at: '2019-03-15', expires_at: inDays(220), alert_days: 90, file_url: null, notes: null, metadata: {} },
  { id: 'd3', member_id: 'm3', member_name: 'Tomás Silva', module: 'documentos', category: 'passaporte', name: 'Passaporte', issuer: 'IRN', issued_at: '2021-07-10', expires_at: inDays(-12), alert_days: 90, file_url: null, notes: 'Necessário para viagem em agosto', metadata: {} },
  { id: 'd4', member_id: 'm1', member_name: 'João Silva', module: 'automovel', category: 'seguro', name: 'Seguro Automóvel — Peugeot 308', issuer: 'Fidelidade', issued_at: '2025-09-01', expires_at: inDays(85), alert_days: 30, file_url: null, notes: null, metadata: { plate: '00-AB-00' } },
  { id: 'd5', member_id: null, module: 'habitacao', category: 'contrato', name: 'Contrato de Arrendamento', issuer: 'Senhorio', issued_at: '2023-08-01', expires_at: inDays(410), alert_days: 60, file_url: null, notes: null, metadata: {} },
]

export const DEMO_BUDGET: BudgetCategory[] = [
  { id: 'b1', name: 'Alimentação', icon: '🛒', color: 'brand', monthly_limit: 600, type: 'expense', spent: 522 },
  { id: 'b2', name: 'Habitação', icon: '🏠', color: 'purple', monthly_limit: 850, type: 'expense', spent: 850 },
  { id: 'b3', name: 'Transportes', icon: '⛽', color: 'red', monthly_limit: 220, type: 'expense', spent: 168 },
  { id: 'b4', name: 'Saúde', icon: '💊', color: 'rose', monthly_limit: 150, type: 'expense', spent: 94 },
  { id: 'b5', name: 'Educação', icon: '🎓', color: 'blue', monthly_limit: 300, type: 'expense', spent: 213 },
  { id: 'b6', name: 'Lazer', icon: '🎬', color: 'amber', monthly_limit: 200, type: 'expense', spent: 0 },
]

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', category_id: 'b1', category_name: 'Alimentação', amount: 87.34, type: 'expense', description: 'Compras semana', merchant: 'Pingo Doce', date: inDays(-1), source: 'ocr', nif_requested: true, irs_category: 'geral', irs_deduction: 0.61 },
  { id: 't2', category_id: 'b4', category_name: 'Saúde', amount: 45.0, type: 'expense', description: 'Consulta pediatria', merchant: 'Clínica Lusíadas', date: inDays(-3), source: 'manual', nif_requested: true, irs_category: 'saude', irs_deduction: 6.75 },
  { id: 't3', category_id: 'b3', category_name: 'Transportes', amount: 62.1, type: 'expense', description: 'Abastecimento', merchant: 'Galp', date: inDays(-4), source: 'ocr', nif_requested: true, irs_category: 'geral', irs_deduction: 0.43 },
  { id: 't4', category_id: 'b5', category_name: 'Educação', amount: 120.0, type: 'expense', description: 'Explicações matemática', merchant: 'Centro Estudos', date: inDays(-6), source: 'manual', nif_requested: false, irs_category: 'educacao', irs_deduction: 0 },
  { id: 't5', category_id: null, category_name: 'Ginásio', amount: 39.9, type: 'expense', description: 'Mensalidade', merchant: 'Fitness Hut', date: inDays(-8), source: 'manual', nif_requested: false, irs_category: 'iva_beneficio', irs_deduction: 0 },
  { id: 't6', category_id: null, category_name: 'Salário', amount: 2450.0, type: 'income', description: 'Vencimento', merchant: 'Entidade Patronal', date: inDays(-10), source: 'manual', nif_requested: false, irs_category: null, irs_deduction: null },
]

export const DEMO_VEHICLES: Vehicle[] = [
  { id: 'v1', name: 'Peugeot 308', plate: '00-AB-00', brand: 'Peugeot', iuc_due: '2026-02-28', insurance_due: inDays(85), inspection_due: inDays(140) },
]

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'document_expiry', title: 'Passaporte do Tomás expirou', body: 'Renove com urgência — viagem prevista para agosto.', module: 'documentos', read: false, created_at: inDays(0) },
  { id: 'n2', type: 'document_expiry', title: 'CC da Maria expira em 47 dias', body: 'O Cartão de Cidadão renova-se a cada 10 anos.', module: 'documentos', read: false, created_at: inDays(-1) },
  { id: 'n3', type: 'sam_tip', title: 'Dica do SAM', body: 'Pediu fatura sem NIF no ginásio este mês. Vai perder cerca de €30 no IRS.', module: 'irs', read: false, created_at: inDays(-2) },
  { id: 'n4', type: 'payment_due', title: 'IUC do Peugeot', body: 'Pagar até 28 de fevereiro.', module: 'automovel', read: true, created_at: inDays(-5) },
]
