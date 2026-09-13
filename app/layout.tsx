import type { Metadata } from 'next'
import { Fraunces, Alegreya_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'], variable: '--font-fraunces' })
const alegreya = Alegreya_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], style: ['normal', 'italic'], variable: '--font-alegreya' })

export const metadata: Metadata = {
  metadataBase: new URL('https://barkeep.morsenza.com'),
  title: 'Barkeep',
  description: 'A robot bartender for the home bar.',
  openGraph: { siteName: 'Barkeep', type: 'website' },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${alegreya.variable}`}>
      <body>{children}</body>
    </html>
  )
}
