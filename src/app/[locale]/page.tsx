import { setRequestLocale } from 'next-intl/server'
import { Hero } from '@/components/sections/hero'
import { WorldInvitation } from '@/components/sections/world-invitation'
import { Works } from '@/components/sections/works'
import { Skills } from '@/components/sections/skills'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/sections/footer'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main id="main-content">
      <Hero />
      <Works />
      <WorldInvitation />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}
