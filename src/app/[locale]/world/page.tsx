import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { WorldLoader } from '@/components/world/world-loader'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'world' })
  return { title: t('metaTitle') }
}

export default async function WorldPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <WorldLoader />
}
