import { NextResponse } from 'next/server'
import { extractDocument, type ExtractedDocument } from '@/lib/ocr/extract'

export const runtime = 'nodejs'

const DEMO_RESULT: ExtractedDocument = {
  doc_type: 'fatura',
  issuer: 'EDP Comercial',
  issuer_nif: '502054***',
  recipient_nif: null,
  amount: 87.34,
  amount_vat: 14.23,
  date_issued: '2026-05-31',
  date_due: '2026-06-15',
  period_start: '2026-05-01',
  period_end: '2026-05-31',
  description: 'Energia eléctrica — Maio 2026',
  category_suggestion: 'energia',
  irs_category: 'geral',
  irs_deduction_possible: true,
  nif_on_document: true,
  confidence: 0.96,
}

export async function POST(req: Request) {
  const { imageUrl } = (await req.json().catch(() => ({}))) as { imageUrl?: string }

  if (!process.env.OPENAI_API_KEY) {
    // Demo mode — return a representative extraction.
    return NextResponse.json({ ...DEMO_RESULT, mode: 'demo' })
  }
  if (!imageUrl) {
    return NextResponse.json({ error: 'imageUrl em falta.' }, { status: 400 })
  }

  try {
    const result = await extractDocument(imageUrl)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro de OCR.' },
      { status: 502 },
    )
  }
}
