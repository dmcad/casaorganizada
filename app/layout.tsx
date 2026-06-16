import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://casaorganizada.pt'),
  title: {
    default: 'Casa Organizada — A vida da sua casa, finalmente organizada.',
    template: '%s · Casa Organizada',
  },
  description:
    'IRS, seguros, documentos, saúde, automóvel, escola — organizado, com alertas automáticos e um assistente inteligente chamado SAM.',
  keywords: ['IRS', 'e-Fatura', 'documentos', 'família', 'Portugal', 'organização', 'finanças'],
  openGraph: {
    title: 'Casa Organizada',
    description: 'A vida administrativa da sua família, finalmente num só lugar.',
    locale: 'pt_PT',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1A9668',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
