'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

/** Three.js を含むチャンクは踏み込んだ人だけがダウンロードする */
const NekoWorld3D = dynamic(() => import('./neko-world').then((m) => m.NekoWorld3D), {
  ssr: false,
  loading: () => <WorldFallback />,
})

function WorldFallback() {
  const t = useTranslations('world')
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[#0b0b0d]">
      <div className="text-center">
        <span className="font-display outline-text--thin block text-[clamp(60px,12vw,120px)] leading-none" aria-hidden="true">
          墨
        </span>
        <p className="font-mono m-0 mt-5 animate-pulse text-[11px] tracking-[0.28em] text-muted">
          {t('loading')}
        </p>
      </div>
    </div>
  )
}

export function WorldLoader() {
  return <NekoWorld3D />
}
