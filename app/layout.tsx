import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import { LayoutWrapper } from '@/components/layout-wrapper'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://skillistan.org'),
  title: {
    default: 'Skillistan — Empowering Youth for Sustainable Growth',
    template: '%s — Skillistan',
  },
  description:
    'Skillistan is a youth-led organization in Pakistan building skills, digital literacy, and climate leadership for the next generation.',
  openGraph: {
    title: 'Skillistan — Empowering Youth for Sustainable Growth',
    description:
      'Skills, sustainability, and leadership programs for young people across Pakistan.',
    url: 'https://skillistan.org',
    siteName: 'Skillistan',
    images: ['/images/group-photo.jpg'],
    locale: 'en_US',
    type: 'website',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbfaf7',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="font-sans antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
