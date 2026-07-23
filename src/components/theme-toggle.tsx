'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

/**
 * 夜 (default) / 昼 toggle. The button shows the theme you would switch TO,
 * written as a kanji (text, deliberately not an icon).
 */
export function ThemeToggle() {
  const t = useTranslations('nav')
  const [hiru, setHiru] = useState(false)

  useEffect(() => {
    setHiru(document.documentElement.dataset.theme === 'hiru')
  }, [])

  const toggle = () => {
    const next = !hiru
    setHiru(next)
    if (next) document.documentElement.dataset.theme = 'hiru'
    else delete document.documentElement.dataset.theme
    try {
      localStorage.setItem('neko-theme', next ? 'hiru' : 'yoru')
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={hiru ? t('toNight') : t('toDay')}
      className="font-mincho grid h-11 w-11 place-items-center rounded-full border border-line text-[15px] transition-colors hover:border-accent hover:text-accent"
    >
      {hiru ? '夜' : '昼'}
    </button>
  )
}
