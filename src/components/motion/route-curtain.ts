type NavigationInput = {
  currentHref: string
  href: string
  target: string
  download: boolean
  defaultPrevented: boolean
  button: number
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
}

type CurtainInput = {
  destinationPath: string
  currentPath: string
  waitForWorld: boolean
  readyPath: string | null
  elapsedMs: number
  timeoutMs: number
  failed: boolean
}

export function getTransitionDestination(input: NavigationInput): string | null {
  if (input.defaultPrevented || input.button !== 0 || input.metaKey || input.ctrlKey || input.shiftKey || input.altKey || input.download) return null
  if (input.target && input.target.toLowerCase() !== '_self') return null

  try {
    const current = new URL(input.currentHref)
    const destination = new URL(input.href, current)
    if (destination.origin !== current.origin || !['http:', 'https:'].includes(destination.protocol)) return null
    if (destination.hash || destination.pathname === current.pathname) return null
    return `${destination.pathname}${destination.search}`
  } catch {
    return null
  }
}

export function getCurtainOutcome(input: CurtainInput): 'pending' | 'ready' | 'timeout' | 'failed' {
  if (input.failed) return 'failed'
  if (input.elapsedMs >= input.timeoutMs) return 'timeout'
  if (input.currentPath === input.destinationPath && (!input.waitForWorld || input.readyPath === input.destinationPath)) return 'ready'
  return 'pending'
}
