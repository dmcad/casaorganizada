/** Lightweight rule-based SAM replies for demo mode (no API key required). */
export interface SamReply {
  text: string
}

const KB: { match: RegExp; reply: string }[] = [
  {
    match: /irs|dedu|recupera|fatura/i,
    reply:
      'Com as faturas registadas este ano, estimo cerca de **847 €** de dedução 🧾\n\n• Saúde: 142 €\n• Educação: 64 €\n• Despesas gerais: 250 € (limite atingido)\n\n⚠️ Reparei que pagaste o ginásio sem NIF — com NIF poderias recuperar mais ~30 €. Próximo passo: pedir sempre fatura com NIF.',
  },
  {
    match: /cc|cartão de cidadão|cidadao/i,
    reply:
      'O **Cartão de Cidadão da Maria** expira em **47 dias**. O CC renova-se a cada 10 anos.\n\nPróximo passo: marca a renovação numa Loja de Cidadão ou online no portal ePortugal.',
  },
  {
    match: /carta|condu/i,
    reply:
      'A **carta de condução do João** é válida por mais 220 dias. Renova-se a cada 5 anos até aos 70.\n\nVou avisar-te 90 dias antes do prazo.',
  },
  {
    match: /iuc|imposto.*carro|automóvel|automovel|carro|seguro/i,
    reply:
      'No teu Peugeot 308:\n• **IUC** — pagar até **28 de fevereiro**.\n• **Seguro** — renova em ~85 dias (Fidelidade).\n• **Inspeção** — em ~140 dias.\n\nQueres que compare propostas de seguro?',
  },
  {
    match: /prazo|deadline|esta semana|este mês|este mes/i,
    reply:
      'Prazos próximos 👇\n• **IUC do Peugeot** — até 28 de fevereiro.\n• **Validar faturas no e-Fatura** — até 28 de fevereiro.\n• **CC da Maria** — expira em 47 dias.\n\nQueres ativar alertas por email?',
  },
  {
    match: /orçamento|orcamento|gast|saldo|despesa/i,
    reply:
      'Este mês gastaram **1.847 €** (74% do orçamento). 🎯\n\n• Habitação: limite atingido (850 €).\n• Alimentação: 522 € de 600 €.\n\nSaldo do mês: **+1.328 €**. Vais bem!',
  },
]

export function getSamReply(input: string): SamReply {
  const found = KB.find((k) => k.match.test(input))
  if (found) return { text: found.reply }
  return {
    text:
      'Boa pergunta! No modo de demonstração consigo ajudar com: IRS e deduções, prazos de documentos (CC, carta), automóvel (IUC, seguro) e orçamento.\n\nExperimenta: "Quanto recupero no IRS?" ou "Tenho algum prazo esta semana?"',
  }
}

export const SAM_SUGGESTIONS = [
  'Quando renova o meu CC?',
  'Quanto recupero no IRS?',
  'Tenho algum prazo esta semana?',
  'Como está o meu orçamento?',
]
