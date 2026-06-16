/**
 * Document OCR + structured extraction using GPT-4o Vision.
 * Returns normalised fields the user then confirms before saving.
 */

export const EXTRACTION_PROMPT = `You are an OCR and document analysis expert for Portuguese documents.
Analyze this document image and extract structured data.

Identify the document type first:
- fatura (invoice/bill)
- extrato_bancario (bank statement)
- recibo (payment receipt)
- seguro (insurance policy)
- contrato (contract)
- documento_identificacao (ID document)
- iuc (vehicle tax)
- imi (property tax)
- outro

Then extract ALL relevant fields and return ONLY a valid JSON object with this structure:
{
  "doc_type": "fatura",
  "issuer": "EDP Comercial",
  "issuer_nif": "502054...",
  "recipient_nif": null,
  "amount": 87.34,
  "amount_vat": 14.23,
  "date_issued": "2026-05-31",
  "date_due": "2026-06-15",
  "period_start": "2026-05-01",
  "period_end": "2026-05-31",
  "description": "Energia eléctrica — Maio 2026",
  "category_suggestion": "energia",
  "irs_category": "geral",
  "irs_deduction_possible": true,
  "nif_on_document": true,
  "confidence": 0.97
}

For bank statements, extract the array of transactions:
{
  "doc_type": "extrato_bancario",
  "bank": "CGD",
  "iban_partial": "...1234",
  "period_start": "2026-05-01",
  "period_end": "2026-05-31",
  "opening_balance": 2341.50,
  "closing_balance": 1893.20,
  "transactions": [
    {
      "date": "2026-05-03",
      "description": "Pingo Doce Queluz",
      "amount": -87.34,
      "category_suggestion": "alimentacao"
    }
  ]
}`

export interface ExtractedDocument {
  doc_type: string
  issuer?: string | null
  issuer_nif?: string | null
  recipient_nif?: string | null
  amount?: number | null
  amount_vat?: number | null
  date_issued?: string | null
  date_due?: string | null
  period_start?: string | null
  period_end?: string | null
  description?: string | null
  category_suggestion?: string | null
  irs_category?: string | null
  irs_deduction_possible?: boolean
  nif_on_document?: boolean
  confidence?: number
  transactions?: Array<{
    date: string
    description: string
    amount: number
    category_suggestion?: string
  }>
}

/**
 * Calls GPT-4o Vision to extract fields from a document image URL.
 * Requires OPENAI_API_KEY. Throws a typed error when unavailable.
 */
export async function extractDocument(imageUrl: string): Promise<ExtractedDocument> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OCR_UNAVAILABLE: OPENAI_API_KEY não está configurada.')
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extrai os dados deste documento.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`OCR_ERROR: ${res.status} ${await res.text()}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? '{}'
  return JSON.parse(content) as ExtractedDocument
}
