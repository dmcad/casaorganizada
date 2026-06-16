import 'server-only'

interface SendEmailArgs {
  to: string | string[]
  subject: string
  html: string
}

/**
 * Sends a transactional email via Resend. No-ops (returns { skipped })
 * when RESEND_API_KEY is not configured, so demo mode never fails.
 */
export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const key = process.env.RESEND_API_KEY
  if (!key) return { skipped: true as const }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? 'Casa Organizada <noreply@casaorganizada.pt>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  })

  if (!res.ok) {
    return { error: await res.text() }
  }
  return { id: (await res.json()).id as string }
}

export interface DigestItem {
  title: string
  detail: string
}

/** Builds the weekly digest HTML in European Portuguese. */
export function weeklyDigestHtml(familyName: string, items: DigestItem[]): string {
  const rows =
    items.length === 0
      ? '<p style="color:#64748b">Nada urgente esta semana. Bom trabalho! 🎉</p>'
      : items
          .map(
            (i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f1f5f9">
            <p style="margin:0;font-weight:600;color:#0f172a">${i.title}</p>
            <p style="margin:4px 0 0;color:#64748b;font-size:14px">${i.detail}</p>
          </td>
        </tr>`,
          )
          .join('')

  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px">
      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
        <p style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 4px">🏠 Casa Organizada</p>
        <p style="color:#64748b;margin:0 0 20px">Resumo semanal da família ${familyName}</p>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://casaorganizada.pt'}/dashboard"
           style="display:inline-block;margin-top:24px;background:#1A9668;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-weight:600">
          Abrir o meu painel
        </a>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">
        Recebe este email porque ativou o resumo semanal. Pode desativar nas Definições.
      </p>
    </div>
  </body>
</html>`
}
