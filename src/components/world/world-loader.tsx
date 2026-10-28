'use client'

import dynamic from 'next/dynamic'
import { Component, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import './pixel-world.css'

/** The 2D pixel town is downloaded only when the visitor enters /world. */
const PixelTown = dynamic(() => import('./pixel-world').then((m) => m.PixelWorld), {
  ssr: false,
  loading: () => <WorldFallback />,
})

function WorldFallback({ failed = false }: { failed?: boolean }) {
  const t = useTranslations('world')
  return (
    <main className="pixel-town" data-palette="blue-yellow">
      <section className="pixel-town__welcome" role={failed ? 'alert' : 'status'}>
        <span className="pixel-town__eyebrow">NEKO TOWN</span>
        <h1>{t(failed ? 'webglError' : 'loading')}</h1>
        <Link href="/" className="pixel-town__button">← {t('back')}</Link>
      </section>
    </main>
  )
}

class WorldErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() {
    delete document.documentElement.dataset.worldReady
    window.dispatchEvent(new CustomEvent('neko:world-error', { detail: { pathname: window.location.pathname } }))
  }
  render() { return this.state.failed ? <WorldFallback failed /> : this.props.children }
}

export function WorldLoader() {
  return <WorldErrorBoundary><PixelTown /></WorldErrorBoundary>
}
