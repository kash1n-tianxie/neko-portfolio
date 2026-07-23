'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

export function LocaleToggle() {
  const pathname = usePathname()
  const locale = useLocale()
  const other = locale === 'ja' ? 'en' : 'ja'

  return (
    <Link
      href={pathname}
      locale={other}
      className="font-mono grid h-11 min-w-11 place-items-center rounded-full border border-line px-2 text-[12px] tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
    >
      {other.toUpperCase()}
    </Link>
  )
}
