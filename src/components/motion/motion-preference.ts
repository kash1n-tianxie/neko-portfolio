/** Resolve to the reduced-motion state; system accessibility settings always win. */
export function resolveMotionPreference(saved: string | null, systemReduced: boolean): boolean {
  return systemReduced || saved === 'off'
}

/** The current root state also works when persistence is unavailable or stale. */
export function resolveEffectiveMotionPreference(
  saved: string | null,
  systemReduced: boolean,
  rootMotion: string | null,
): boolean {
  return resolveMotionPreference(rootMotion === 'off' || rootMotion === 'on' ? rootMotion : saved, systemReduced)
}

export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return true
  let saved: string | null = null
  try { saved = localStorage.getItem('neko-motion') } catch { /* Root state is the session fallback. */ }
  return resolveEffectiveMotionPreference(
    saved,
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    document.documentElement.getAttribute('data-motion'),
  )
}

export function subscribeMotionPreference(onChange: () => void): () => void {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
  query.addEventListener('change', onChange)
  window.addEventListener('neko:motion-change', onChange)
  window.addEventListener('storage', onChange)
  return () => {
    observer.disconnect()
    query.removeEventListener('change', onChange)
    window.removeEventListener('neko:motion-change', onChange)
    window.removeEventListener('storage', onChange)
  }
}
