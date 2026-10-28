'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { works, githubUrl } from '@/content/works'
import { email } from '@/content/profile'
import { PixelPaletteToggle, getPixelPalette, usePixelPalette } from './pixel-palette'
import { useReducedMotion } from '../motion/use-reduced-motion'
import { getReducedMotionPreference } from '../motion/motion-preference'
import { PixelGame } from './pixel/pixel-game'
import { TOWN_MAP } from './pixel/town-map'
import type { PixelLocale, PixelSnapshot } from './pixel/world-types'
import './pixel-world.css'

export function validateDiscoveries(value: unknown, knownIds: readonly string[]): string[] {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && knownIds.includes(id)))]
}

export function readDiscoveries(read: (key: string) => string | null, knownIds: readonly string[]): string[] {
  try { return validateDiscoveries(JSON.parse(read('neko-pixel-discoveries-v1') ?? '[]'), knownIds) }
  catch { return [] }
}

export function saveDiscoveries(write: (key: string, value: string) => void, ids: readonly string[]) {
  try { write('neko-pixel-discoveries-v1', JSON.stringify(ids)) }
  catch { /* A private or full browser storage must not interrupt play. */ }
}

const COPY = {
  en: {
    title: 'A little town, a curious cat.', eyebrow: 'KASHIN’S PIXEL TOWN',
    intro: 'Take a slow walk. Meet the neighbors, fish by the pond, and discover the projects tucked around town.',
    start: 'Let’s wander', loading: 'Opening the town…', back: 'Portfolio', journal: 'Journal', help: 'Controls',
    progress: 'discoveries', close: 'Close', next: 'Next', done: 'Back to town', visit: 'Explore this project',
    empty: 'Your journal is waiting for its first story. Walk up to a cat, a project board, or the pond.',
    journalIntro: 'Small discoveries from your walk. Select an entry to read it again.',
    helpIntro: 'No rush, no score. Your discoveries are saved in this browser.',
    moveHelp: 'Move with WASD or the arrow keys. On a phone, hold the direction buttons.',
    tapHelp: 'Click or tap a clear spot in town — or a destination on the minimap — to walk there.',
    interactHelp: 'Get close, then press E or Space — or use the action button. At the pond, wait for a bite before reeling in.',
    closeHelp: 'Escape closes a conversation or window. Tab moves between buttons.',
    canvas: 'Pixel cat town. Move with arrow keys or WASD; interact with E or Space. Click an open area to walk there.',
    talk: 'Talk to', inspect: 'Read', fish: 'Cast a line', mail: 'Open mailbox', reel: 'Reel in!',
    waiting: 'A quiet moment… wait for a bite.', bite: 'A bite! Reel in now.',
    early: 'A little early. Cast again when you’re ready.', missed: 'It got away. Try another cast.', caught: 'A new story on the line!',
    error: 'The town couldn’t open this time.', retry: 'Try again', email: 'Send an email', github: 'Visit GitHub',
    up: 'Move up', down: 'Move down', left: 'Move left', right: 'Move right', newEntry: 'Discovered',
  },
  ja: {
    title: '小さな町、きままな猫。', eyebrow: 'KASHIN’S PIXEL TOWN',
    intro: '猫になって、のんびりお散歩。住民に話しかけたり、池で釣りをしたり。町にかくれた作品を見つけよう。',
    start: 'お散歩をはじめる', loading: '町をひらいています…', back: 'ポートフォリオ', journal: '手帳', help: '遊び方',
    progress: 'つの発見', close: '閉じる', next: 'つづきを読む', done: '町にもどる', visit: 'この作品を詳しく見る',
    empty: '手帳はまだまっしろ。猫や作品の看板、池に近づいてみよう。',
    journalIntro: 'お散歩で集めた、小さな発見。選ぶと、もう一度読めます。',
    helpIntro: '急がなくて大丈夫。見つけた発見は、このブラウザに保存されます。',
    moveHelp: 'WASD・矢印キーで移動。スマートフォンでは方向ボタンを長押し。',
    tapHelp: '町の歩ける場所、またはミニマップの行きたい場所をクリック・タップしても移動できます。',
    interactHelp: '近づいて E・スペースキー、またはアクションボタン。池では、魚がかかってから引き上げよう。',
    closeHelp: 'Escで会話やウィンドウを閉じます。Tabでボタンを選べます。',
    canvas: '猫のピクセルタウン。WASD・矢印キーで移動、E・スペースキーで調べる。空いている場所をクリックして移動できます。',
    talk: '話しかける：', inspect: '読む：', fish: '釣り糸をたらす', mail: 'ポストをひらく', reel: '引き上げる！',
    waiting: 'のんびり、魚を待っています…', bite: 'かかった！いま引き上げよう。',
    early: 'ちょっと早かったみたい。もう一度どうぞ。', missed: '逃げられちゃった。もう一度どうぞ。', caught: '新しい物語が釣れました！',
    error: '町をひらけませんでした。', retry: 'もう一度ためす', email: 'メールを送る', github: 'GitHubを見る',
    up: '上に移動', down: '下に移動', left: '左に移動', right: '右に移動', newEntry: '発見したもの',
  },
} as const

function TownDialog({ title, onClose, closeLabel, children, focusRef }: {
  title: string; onClose: () => void; closeLabel: string; children: ReactNode; focusRef: RefObject<HTMLCanvasElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const fallback = focusRef.current
    ref.current?.focus()
    return () => { if (previous?.isConnected) previous.focus(); else fallback?.focus() }
  }, [focusRef])
  return (
    <div className="pixel-town__veil">
      <div className="pixel-town__dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        onKeyDown={event => {
          if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return }
          if (event.key !== 'Tab') return
          const nodes = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]') ?? [])
          const first = nodes[0], last = nodes[nodes.length - 1]
          if (!first) { event.preventDefault(); return }
          if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
            event.preventDefault(); last.focus()
          } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) {
            event.preventDefault(); first.focus()
          }
        }}>
        <header className="pixel-town__dialog-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="pixel-town__icon-button" onClick={onClose} aria-label={closeLabel}>×</button>
        </header>
        {children}
      </div>
    </div>
  )
}

export function PixelWorld() {
  const locale: PixelLocale = useLocale() === 'ja' ? 'ja' : 'en'
  const copy = COPY[locale]
  const [palette] = usePixelPalette()
  const reducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<PixelGame | null>(null)
  const [snapshot, setSnapshot] = useState<PixelSnapshot | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [started, setStarted] = useState(false)
  const [panel, setPanel] = useState<'journal' | 'help' | null>(null)
  const [line, setLine] = useState(0)
  const lastSaved = useRef('')
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const activeSpot = TOWN_MAP.spots.find(spot => spot.id === snapshot?.activeId)
  const nearby = TOWN_MAP.spots.find(spot => spot.id === snapshot?.nearbyId)
  const discovered = snapshot?.discovered ?? []
  const work = works.find(item => item.slug === activeSpot?.workSlug)

  const releaseMovement = useCallback(() => {
    pointers.current.clear()
    gameRef.current?.move(0, 0)
  }, [])
  const closeDialog = useCallback(() => {
    releaseMovement()
    setPanel(null)
    gameRef.current?.close()
    setLine(0)
  }, [releaseMovement])

  useEffect(() => {
    // The portfolio navigation is visually covered by this full-screen route.
    // Remove only those known outer controls from keyboard / screen-reader reach.
    const outerControls = Array.from(document.querySelectorAll<HTMLElement>('.site-nav, .skip-link'))
      .filter(element => !element.closest('.pixel-town'))
    const saved = outerControls.map(element => ({
      element, inert: element.inert, hidden: element.getAttribute('aria-hidden'),
    }))
    if (outerControls.some(element => element.contains(document.activeElement))) canvasRef.current?.focus()
    for (const { element } of saved) { element.inert = true; element.setAttribute('aria-hidden', 'true') }
    return () => {
      for (const { element, inert, hidden } of saved) {
        element.inert = inert
        if (hidden === null) element.removeAttribute('aria-hidden')
        else element.setAttribute('aria-hidden', hidden)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const root = document.documentElement
    const heldPointers = pointers.current
    const pathname = window.location.pathname
    let disposed = false
    delete root.dataset.worldReady
    const onError = () => {
      if (disposed) return
      delete root.dataset.worldReady
      setFailed(true)
      window.dispatchEvent(new CustomEvent('neko:world-error', { detail: { pathname } }))
    }
    let game: PixelGame | null = null
    try {
      const saved = readDiscoveries(key => localStorage.getItem(key), TOWN_MAP.spots.map(spot => spot.id))
      lastSaved.current = JSON.stringify(saved)
      game = new PixelGame(canvas, {
        onChange: (next: PixelSnapshot) => {
          if (disposed) return
          setSnapshot(next)
          const ids = validateDiscoveries(next.discovered, TOWN_MAP.spots.map(spot => spot.id))
          const serialized = JSON.stringify(ids)
          if (serialized !== lastSaved.current) {
            lastSaved.current = serialized
            saveDiscoveries((key, value) => localStorage.setItem(key, value), ids)
          }
        },
        onReady: () => {
          if (disposed) return
          setReady(true)
          root.dataset.worldReady = pathname
          window.dispatchEvent(new CustomEvent('neko:world-ready', { detail: { pathname } }))
        },
        onError,
      }, { locale, palette: getPixelPalette(), reducedMotion: getReducedMotionPreference(), discovered: saved })
      gameRef.current = game
      game.setPaused(true)
      game.play()
      setSnapshot(game.snapshot())
    } catch { onError() }
    return () => {
      disposed = true
      game?.dispose()
      gameRef.current = null
      heldPointers.clear()
      delete root.dataset.worldReady
    }
  }, [locale])

  useEffect(() => { gameRef.current?.setPalette(palette) }, [palette])
  useEffect(() => { gameRef.current?.setReducedMotion(reducedMotion) }, [reducedMotion])
  useEffect(() => {
    const updatePaused = () => {
      releaseMovement()
      gameRef.current?.setPaused(!started || panel !== null || document.hidden)
    }
    updatePaused()
    document.addEventListener('visibilitychange', updatePaused)
    window.addEventListener('blur', releaseMovement)
    return () => {
      document.removeEventListener('visibilitychange', updatePaused)
      window.removeEventListener('blur', releaseMovement)
    }
  }, [started, panel, releaseMovement])
  useEffect(() => { if (snapshot?.activeId) releaseMovement() }, [snapshot?.activeId, releaseMovement])
  useEffect(() => { setLine(0) }, [snapshot?.activeId])

  const openPanel = (value: 'journal' | 'help') => {
    releaseMovement()
    gameRef.current?.close()
    setPanel(value)
  }
  const start = () => {
    setStarted(true)
    gameRef.current?.setPaused(false)
    canvasRef.current?.focus()
  }
  const actionLabel = snapshot?.fishing === 'bite' ? copy.reel : nearby?.kind === 'npc'
    ? `${copy.talk} ${nearby.name[locale]}` : nearby?.kind === 'pond' ? copy.fish
      : nearby?.kind === 'mailbox' ? copy.mail : nearby ? `${copy.inspect} ${nearby.name[locale]}` : ''
  const fishingText = snapshot?.fishing === 'waiting' ? copy.waiting : snapshot?.fishing === 'bite' ? copy.bite
    : snapshot?.notice ? copy[snapshot.notice] : null
  const canInteract = !!nearby && snapshot?.fishing !== 'waiting'
  const directions = [
    { id: 'up', x: 0, y: -1, icon: '↑', label: copy.up },
    { id: 'left', x: -1, y: 0, icon: '←', label: copy.left },
    { id: 'down', x: 0, y: 1, icon: '↓', label: copy.down },
    { id: 'right', x: 1, y: 0, icon: '→', label: copy.right },
  ]
  const updateMovement = () => {
    let x = 0, y = 0
    for (const direction of pointers.current.values()) { x += direction.x; y += direction.y }
    gameRef.current?.move(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)))
  }

  return (
    <main className="pixel-town" data-palette={palette} data-started={started}>
      <canvas ref={canvasRef} className="pixel-town__canvas" tabIndex={started && !panel && !activeSpot ? 0 : -1}
        aria-label={copy.canvas} data-game-state={snapshot ? JSON.stringify(snapshot) : '{}'} />
      <span className="pixel-town__announcement" role="status" aria-live="polite" aria-atomic="true">
        {started && !failed && snapshot?.fishing !== 'bite' ? fishingText : ''}
      </span>
      <span className="pixel-town__announcement" role="alert" aria-live="assertive" aria-atomic="true">
        {started && !failed && snapshot?.fishing === 'bite' ? copy.bite : ''}
      </span>
      <header className="pixel-town__hud">
        <Link className="pixel-town__button pixel-town__back" href="/" aria-label={copy.back}>← <span>{copy.back}</span></Link>
        <span className="pixel-town__brand" aria-hidden="true">NEKO TOWN <i>01</i></span>
        <div className="pixel-town__tools">
          {started && <>
            <span className="pixel-town__progress" aria-label={`${discovered.length} / ${TOWN_MAP.spots.length} ${copy.progress}`}>
              <span aria-hidden="true">✦</span> {discovered.length}<span className="pixel-town__progress-total"> / {TOWN_MAP.spots.length}</span>
            </span>
            <button className="pixel-town__button" type="button" onClick={() => openPanel('journal')}>{copy.journal}</button>
            <button className="pixel-town__button pixel-town__help" type="button" onClick={() => openPanel('help')} aria-label={copy.help}>?</button>
          </>}
          <div className="pixel-town__theme"><PixelPaletteToggle /></div>
        </div>
      </header>

      {failed ? <section className="pixel-town__welcome pixel-town__error" role="alert">
        <span className="pixel-town__eyebrow">A LITTLE DETOUR</span>
        <h1>{copy.error}</h1>
        <button className="pixel-town__button pixel-town__button--primary" type="button" onClick={() => window.location.reload()}>{copy.retry}</button>
        <Link className="pixel-town__text-link" href="/">← {copy.back}</Link>
      </section> : !started && <section className="pixel-town__welcome" aria-labelledby="pixel-town-welcome-title">
        <span className="pixel-town__eyebrow">{copy.eyebrow}</span>
        <div className="pixel-town__welcome-heading"><span className="pixel-town__cat" aria-hidden="true" /><h1 id="pixel-town-welcome-title">{copy.title}</h1></div>
        <p>{copy.intro}</p>
        <button className="pixel-town__button pixel-town__button--primary" type="button" onClick={start} disabled={!ready}>{ready ? copy.start : copy.loading}<span aria-hidden="true">→</span></button>
      </section>}

      {started && !failed && !panel && !activeSpot && <>
        <div className="pixel-town__desktop-hint" aria-hidden="true"><kbd>W A S D</kbd> / <kbd>↑ ← ↓ →</kbd><span>·</span><kbd>E</kbd> {locale === 'ja' ? '調べる' : 'interact'}</div>
        <div className="pixel-town__dpad" role="group" aria-label={locale === 'ja' ? '移動操作' : 'Movement controls'}>
          {directions.map(direction => <button key={direction.id} type="button" className={`pixel-town__direction pixel-town__direction--${direction.id}`} aria-label={direction.label}
            onClick={event => { if (event.detail === 0) { releaseMovement(); gameRef.current?.nudge(direction.x, direction.y) } }}
            onPointerDown={event => {
              event.preventDefault()
              event.currentTarget.setPointerCapture(event.pointerId)
              pointers.current.set(event.pointerId, direction)
              updateMovement()
            }}
            onPointerUp={event => { pointers.current.delete(event.pointerId); updateMovement() }}
            onPointerCancel={event => { pointers.current.delete(event.pointerId); updateMovement() }}
            onLostPointerCapture={event => { pointers.current.delete(event.pointerId); updateMovement() }}
            onBlur={releaseMovement}>{direction.icon}</button>)}
        </div>
        {(nearby || fishingText) && <div className="pixel-town__interaction">
          {fishingText && <p className="pixel-town__fishing" data-phase={snapshot?.fishing}>{fishingText}</p>}
          {nearby && <button type="button" className="pixel-town__button pixel-town__button--primary" disabled={!canInteract}
            onClick={() => { releaseMovement(); canvasRef.current?.focus(); gameRef.current?.interact() }}><kbd aria-hidden="true">E</kbd>{actionLabel}</button>}
        </div>}
      </>}

      {panel && <TownDialog title={panel === 'journal' ? copy.journal : copy.help} closeLabel={copy.close} onClose={closeDialog} focusRef={canvasRef}>
        {panel === 'journal' ? <>
          <p className="pixel-town__muted">{copy.journalIntro}</p>
          <p className="pixel-town__journal-count">{discovered.length} / {TOWN_MAP.spots.length} {copy.progress}</p>
          {discovered.length === 0 ? <p className="pixel-town__empty">{copy.empty}</p> : <ul className="pixel-town__entries">
            {TOWN_MAP.spots.filter(spot => discovered.includes(spot.id)).map(spot => <li key={spot.id}>
              <button type="button" onClick={() => { setPanel(null); setLine(0); gameRef.current?.openEntry(spot.id) }}>
                <span className="pixel-town__entry-mark" aria-hidden="true">{spot.kind === 'pond' ? '≈' : spot.kind === 'mailbox' ? '↗' : '✦'}</span>
                <span><small>{spot.name[locale]}</small><strong>{spot.title[locale]}</strong></span><span aria-hidden="true">→</span>
              </button>
            </li>)}
          </ul>}
        </> : <>
          <p>{copy.helpIntro}</p>
          <ul className="pixel-town__instructions"><li>{copy.moveHelp}</li><li>{copy.tapHelp}</li><li>{copy.interactHelp}</li><li>{copy.closeHelp}</li></ul>
        </>}
      </TownDialog>}

      {activeSpot && !panel && <TownDialog title={activeSpot.name[locale]} closeLabel={copy.close} onClose={closeDialog} focusRef={canvasRef}>
        <div className="pixel-town__story">
          <span className={`pixel-town__portrait pixel-town__portrait--${activeSpot.sprite ?? activeSpot.kind}`} aria-hidden="true">
            {activeSpot.kind === 'npc' ? <span className="pixel-town__cat" /> : <span className="pixel-town__landmark-icon">{activeSpot.kind === 'pond' ? '≈' : activeSpot.kind === 'mailbox' ? '↗' : '▤'}</span>}
          </span>
          <div><span className="pixel-town__eyebrow">{copy.newEntry}</span><h3>{activeSpot.title[locale]}</h3>
            <p className="pixel-town__story-text">{activeSpot.lines[locale][Math.min(line, activeSpot.lines[locale].length - 1)]}</p>
          </div>
        </div>
        {line >= activeSpot.lines[locale].length - 1 && <div className="pixel-town__story-links">
          {work && <Link className="pixel-town__text-link" href={`/works/${work.slug}`}>{copy.visit} <span aria-hidden="true">↗</span></Link>}
          {activeSpot.kind === 'mailbox' && <><a className="pixel-town__text-link" href={`mailto:${email}`}>{copy.email} ↗</a><a className="pixel-town__text-link" href={githubUrl} target="_blank" rel="noopener noreferrer">{copy.github} ↗</a></>}
        </div>}
        <footer className="pixel-town__story-footer"><span>{Math.min(line + 1, activeSpot.lines[locale].length)} / {activeSpot.lines[locale].length}</span>
          <button type="button" className="pixel-town__button pixel-town__button--primary" onClick={() => {
            if (line < activeSpot.lines[locale].length - 1) setLine(value => value + 1)
            else closeDialog()
          }}>{line < activeSpot.lines[locale].length - 1 ? copy.next : copy.done}<span aria-hidden="true">→</span></button>
        </footer>
      </TownDialog>}
    </main>
  )
}
