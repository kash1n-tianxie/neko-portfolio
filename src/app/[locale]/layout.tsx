import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import {
  Anton,
  Inter,
  JetBrains_Mono,
  Shippori_Mincho_B1,
  Zen_Kaku_Gothic_New,
} from 'next/font/google'
import { routing } from '@/i18n/routing'
import { Nav } from '@/components/nav'
import { MotionProvider } from '@/components/motion/motion-provider'
import { InkCursor } from '@/components/motion/ink-cursor'
import { CanvasPageTransition } from '@/components/motion/canvas-page-transition'
import '../globals.css'

const shippori = Shippori_Mincho_B1({
  weight: ['700', '800'],
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-shippori',
})
const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
})
const zen = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
  display: 'swap',
  variable: '--font-zen',
})
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
const jbmono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jbmono',
})

// applied before paint so the chosen theme never flashes
const themeScript = `try{if(localStorage.getItem('neko-theme')==='hiru')document.documentElement.dataset.theme='hiru'}catch(e){}`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  const navT = await getTranslations({ locale, namespace: 'nav' })

  return (
    <html
      lang={locale}
      className={`${shippori.variable} ${anton.variable} ${zen.variable} ${inter.variable} ${jbmono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-bg text-ink font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="grain" aria-hidden="true" />
          <div className="ink-progress" aria-hidden="true" />
          <a href="#main-content" className="skip-link">
            {navT('skip')}
          </a>
          <Nav />
          {children}
          <CanvasPageTransition />
          <MotionProvider />
          <InkCursor />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
