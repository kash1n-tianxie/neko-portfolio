'use client'

import { useLocale } from 'next-intl'
import { CatArt } from './motion/cat-companion'
import { nextPalette, type Palette } from './palette-preference'
import { getPalette, usePalette } from './palette-store'
import './theme-toggle.css'

const palettes: Palette[] = ['blue-yellow', 'red-black']
const labels = { 'blue-yellow': 'BLUE / YELLOW', 'red-black': 'RED / BLACK' }

/** Persistent compact switch, also available outside the mobile drawer. */
export function ThemeToggle() {
  const [palette, selectPalette] = usePalette()
  const ja = useLocale() === 'ja'
  return (
    <button
      type="button"
      className="palette-toggle"
      aria-label={ja ? `配色を切り替える：現在 ${labels[palette]}` : `Change palette: currently ${labels[palette]}`}
      title={ja ? '配色を切り替える' : 'Change palette'}
      onClick={() => selectPalette(nextPalette(getPalette()))}
    >
      <span className="palette-toggle__swatch" data-palette-preview={palette} aria-hidden="true" />
      <span className="palette-toggle__label" aria-hidden="true">{palette === 'blue-yellow' ? 'B / Y' : 'R / B'}</span>
    </button>
  )
}

/** Outfit portraits use the same registered art as the interactive Hero. */
export function ThemeCards() {
  const [palette, selectPalette] = usePalette()
  const ja = useLocale() === 'ja'
  const cycle = () => selectPalette(nextPalette(getPalette()))
  return (
    <div className="palette-cards" role="group" aria-label={ja ? '配色を選ぶ' : 'Choose a palette'}>
      <button type="button" className="palette-cards__arrow" onClick={cycle} aria-label={ja ? '前の配色' : 'Previous palette'}>
        <span aria-hidden="true">‹</span>
      </button>
      {palettes.map((value, index) => (
        <button
          key={value}
          type="button"
          className="palette-card"
          data-palette-preview={value}
          aria-pressed={palette === value}
          aria-label={labels[value]}
          onClick={() => selectPalette(value)}
        >
          <span className="palette-card__number" aria-hidden="true">0{index + 1}</span>
          <span className="palette-card__portrait" aria-hidden="true">
            <CatArt palette={value} />
          </span>
          <span className="palette-card__label">{labels[value]}</span>
          <span className="palette-card__marker" aria-hidden="true">▲</span>
        </button>
      ))}
      <button type="button" className="palette-cards__arrow" onClick={cycle} aria-label={ja ? '次の配色' : 'Next palette'}>
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}
