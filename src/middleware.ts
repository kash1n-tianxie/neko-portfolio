import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // skip api routes, next internals and all static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
