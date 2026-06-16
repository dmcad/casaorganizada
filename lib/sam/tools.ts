/**
 * SAM function-calling tool definitions (OpenAI / Anthropic compatible shape).
 * Each tool is resolved server-side against the authenticated user's Supabase
 * data — SAM never receives raw credentials, full NIF, or IBAN.
 */
export const SAM_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_upcoming_deadlines',
      description: 'Lista prazos próximos (documentos a expirar, obrigações fiscais) num horizonte de dias.',
      parameters: {
        type: 'object',
        properties: {
          within_days: { type: 'number', description: 'Janela em dias (ex.: 30, 90).' },
          module: { type: 'string', description: 'Opcional: filtrar por módulo.' },
        },
        required: ['within_days'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_irs_summary',
      description: 'Resumo das deduções de IRS por categoria para um ano fiscal.',
      parameters: {
        type: 'object',
        properties: { tax_year: { type: 'number' } },
        required: ['tax_year'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_budget_status',
      description: 'Estado do orçamento do mês: gasto, limites por categoria e saldo.',
      parameters: {
        type: 'object',
        properties: { month: { type: 'string', description: 'AAAA-MM. Por omissão, mês atual.' } },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_family_members',
      description: 'Lista os membros do agregado familiar.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'navigate_to_module',
      description: 'Devolve uma instrução de navegação para o cliente abrir um módulo específico.',
      parameters: {
        type: 'object',
        properties: { module_id: { type: 'string' } },
        required: ['module_id'],
      },
    },
  },
] as const
