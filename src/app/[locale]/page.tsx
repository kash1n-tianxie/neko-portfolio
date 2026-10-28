import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/hero'
import { WorldInvitation } from '@/components/sections/world-invitation'
import { Works } from '@/components/sections/works'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'
import '@/components/sections/manga-home.css'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main id="main-content" className="manga-home">
      <div className="manga-backdrop" aria-hidden="true"><span data-scroll-paper /><i data-scroll-word>MAKE / PLAY / REPEAT</i></div>
      <Hero />
      <Works />
      <WorldInvitation />
      <Contact />
      <Footer />
    </main>
  )
}
