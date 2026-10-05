import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Game exports use their own relative assets and must never enter locale routing.
  matcher: ['/((?!api|games(?:/|$)|_next|_vercel|.*\\..*).*)'],
}
