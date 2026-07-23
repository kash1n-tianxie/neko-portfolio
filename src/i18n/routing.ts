import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['ja', 'en'],
  defaultLocale: 'ja',
  // ja lives at "/", en at "/en"
  localePrefix: 'as-needed',
})
