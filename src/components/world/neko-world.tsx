'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { works, githubUrl } from '@/content/works'
import { featuredWorks, type FeaturedWork } from '@/content/featured-works'
import { email, languages, pr, skills, timeline } from '@/content/profile'
import {
  NekoWorld,
  type FishingNote,
  type FishingPhase,
  type InteractKind,
  type PromptTarget,
} from './engine/engine'
import { WorldMap } from './world-map'
import { WORLD_DESTINATIONS, type WorldDestinationId, type WorldPosition } from './destinations'
import './world-ui.css'

type PanelId = 'skills' | 'about' | 'contact'

const PANEL_TITLE_KEYS: Record<PanelId, string> = {
  skills: 'panelSkills',
  about: 'panelAbout',
  contact: 'panelContact',
}

const PROMPT_KEYS: Record<InteractKind, string> = {
  fish: 'promptFish',
  skills: 'promptSkills',
  about: 'promptAbout',
  contact: 'promptContact',
  exit: 'promptExit',
  npc: 'promptTalk',
  kitten: 'promptKitten',
  viewpoint: 'promptViewpoint',
  milestone: 'promptMilestone',
  featured: 'promptFeatured',
}

const NPC_KEYS: Record<string, { name: string; lines: string }> = {
  guide: { name: 'npcGuideName', lines: 'npcGuideLines' },
  junior: { name: 'npcJuniorName', lines: 'npcJuniorLines' },
  agent: { name: 'npcAgentName', lines: 'npcAgentLines' },
}

const KITTEN_KEYS: Record<string, string> = {
  ear: 'kittenEar',
  tail: 'kittenTail',
  pond: 'kittenPond',
}

const TOTAL_KITTENS = 3
const worldWorks = works.filter((work) => work.slug !== 'tamago-exe' && work.slug !== 'hyakki-lantern')

type Dialogue = { name: string; lines: string[]; index: number }

export function NekoWorld3D() {
  const t = useTranslations('world')
  const worksT = useTranslations('works')
  const caseT = useTranslations('caseStudy')
  const locale = useLocale() as 'ja' | 'en'
  const router = useRouter()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<NekoWorld | null>(null)

  const [started, setStarted] = useState(false)
  const [introStage, setIntroStage] = useState<'prologue' | 'ready'>('prologue')
  const [prologueVisible, setPrologueVisible] = useState(false)
  const [coarse, setCoarse] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)

  const [prompt, setPrompt] = useState<PromptTarget | null>(null)
  const [fishing, setFishing] = useState<FishingPhase>('none')
  const [toast, setToast] = useState<string | null>(null)
  const [caughtSlug, setCaughtSlug] = useState<string | null>(null)
  const [caseOpen, setCaseOpen] = useState(false)
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [dialogue, setDialogue] = useState<Dialogue | null>(null)
  const [milestone, setMilestone] = useState<number | null>(null)
  const [caughtSet, setCaughtSet] = useState<ReadonlySet<string>>(new Set())
  const [kittens, setKittens] = useState<ReadonlySet<string>>(new Set())
  const [revealing, setRevealing] = useState(false)
  const [locked, setLocked] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [featuredId, setFeaturedId] = useState<FeaturedWork['id'] | null>(null)
  const [position, setPosition] = useState<WorldPosition>({ x: 0, z: 27, heading: Math.PI / 2 })
  const [goldenHour, setGoldenHour] = useState(false)
  const [lowPower, setLowPower] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [arrival, setArrival] = useState(0)
  const mapOpenRef = useRef(false)

  useEffect(() => { mapOpenRef.current = mapOpen }, [mapOpen])

  const toastTimer = useRef<number>(0)
  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast(text)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  // エンジン側のコールバックから翻訳を引くための参照
  const helpers = useRef<{
    toastKey: (key: string) => void
    talk: (npcId: string) => void
    kitten: (id: string) => void
  }>({
    toastKey: () => {},
    talk: () => {},
    kitten: () => {},
  })
  useEffect(() => {
    helpers.current.toastKey = (key: string) => showToast(t(key))
    helpers.current.talk = (npcId: string) => {
      const keys = NPC_KEYS[npcId]
      if (!keys) return
      const done = npcId === 'guide' && kittens.size >= TOTAL_KITTENS
      const raw = t.raw(done ? 'npcGuideDoneLines' : keys.lines)
      const lines = Array.isArray(raw) ? (raw as string[]) : [String(raw)]
      setDialogue({ name: t(keys.name), lines, index: 0 })
    }
    helpers.current.kitten = (id: string) => {
      const key = KITTEN_KEYS[id]
      setDialogue({ name: t('kittenName'), lines: [t(key)], index: 0 })
    }
  }, [t, showToast, kittens])

  // 島は常に昼なので、HUD もサイトの「昼」テーマに合わせる（離脱時に元へ戻す）
  useEffect(() => {
    const root = document.documentElement
    const previous = root.dataset.theme
    root.dataset.theme = 'hiru'
    return () => {
      if (previous) root.dataset.theme = previous
      else delete root.dataset.theme
    }
  }, [])

  // 序章：猫になった想像へ誘う一拍。クリックでスキップ可
  useEffect(() => {
    if (introStage !== 'prologue') return
    const show = requestAnimationFrame(() => setPrologueVisible(true))
    const advance = window.setTimeout(() => setIntroStage('ready'), 2600)
    return () => {
      cancelAnimationFrame(show)
      window.clearTimeout(advance)
    }
  }, [introStage])

  // エンジンの生成・破棄
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
    setLowPower(window.innerWidth < 768)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(motionQuery.matches)
    const updateMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    motionQuery.addEventListener('change', updateMotion)

    let engine: NekoWorld
    try {
      engine = new NekoWorld(
        canvas,
        worldWorks.map((w) => ({ slug: w.slug, tag: w.tag })),
        {
          onPrompt: (target) => setPrompt(target),
          onFishing: (phase: FishingPhase, note?: FishingNote) => {
            setFishing(phase)
            if (note === 'early') helpers.current.toastKey('fishingEarly')
          },
          onCatch: (slug) => {
            setCaughtSlug(slug)
            setCaughtSet((prev) => new Set(prev).add(slug))
          },
          onPanel: (id) => setPanel(id),
          onExit: () => router.push('/'),
          onTalk: (npcId) => helpers.current.talk(npcId),
          onKitten: (id) => {
            setKittens((prev) => new Set(prev).add(id))
            helpers.current.kitten(id)
          },
          onMilestone: (index) => setMilestone(index),
          onReveal: (active) => setRevealing(active),
          onPointerLock: (isLocked) => setLocked(isLocked),
          onFeatured: (id) => setFeaturedId(id),
          onPosition: (next) => { if (mapOpenRef.current) setPosition(next) },
        },
        { locale },
      )
    } catch {
      setWebglFailed(true)
      motionQuery.removeEventListener('change', updateMotion)
      return
    }
    engineRef.current = engine
    engine.run()
    return () => {
      engine.dispose()
      motionQuery.removeEventListener('change', updateMotion)
      window.clearTimeout(toastTimer.current)
      engineRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const overlayOpen = panel !== null || caughtSlug !== null || dialogue !== null || milestone !== null || mapOpen || helpOpen || featuredId !== null

  useEffect(() => {
    engineRef.current?.setUIOpen(!started || overlayOpen)
  }, [started, overlayOpen])

  // 子猫を全員見つけたら島が黄昏に変わる
  useEffect(() => {
    if (kittens.size >= TOTAL_KITTENS) {
      engineRef.current?.setGoldenHour(true)
      setGoldenHour(true)
      showToast(t('kittensAllFound'))
    }
  }, [kittens, t, showToast])

  const closeCaught = useCallback(() => {
    setCaughtSlug(null)
    setCaseOpen(false)
    engineRef.current?.releaseFish()
  }, [])

  const advanceDialogue = useCallback(() => {
    setDialogue((current) => {
      if (!current) return null
      return current.index + 1 >= current.lines.length
        ? null
        : { ...current, index: current.index + 1 }
    })
  }, [])

  // Esc で閉じる／E と Enter で会話を進める
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mapOpen) setMapOpen(false)
        else if (helpOpen) setHelpOpen(false)
        else if (featuredId) setFeaturedId(null)
        else if (caughtSlug) closeCaught()
        else if (panel) setPanel(null)
        else if (milestone !== null) setMilestone(null)
        else if (dialogue) setDialogue(null)
        return
      }
      if ((event.code === 'KeyE' || event.code === 'Enter' || event.code === 'Space') && dialogue) {
        event.preventDefault()
        advanceDialogue()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [caughtSlug, panel, dialogue, milestone, mapOpen, helpOpen, featuredId, closeCaught, advanceDialogue])

  useEffect(() => {
    if (!started) return
    const timeout = window.setTimeout(() => setShowControls(false), 9000)
    return () => window.clearTimeout(timeout)
  }, [started])

  const start = () => {
    setStarted(true)
    setShowControls(true)
    engineRef.current?.start()
  }

  const openMap = () => {
    const current = engineRef.current?.getPosition()
    if (current) setPosition(current)
    setMapOpen(true)
  }

  const travel = (id: WorldDestinationId) => {
    setMapOpen(false)
    engineRef.current?.travelTo(id)
    requestAnimationFrame(() => canvasRef.current?.focus())
    const destination = WORLD_DESTINATIONS.find((item) => item.id === id)!
    showToast(t('arrivalMessage', { place: t(destination.labelKey) }))
    if (!reducedMotion) setArrival((value) => value + 1)
  }

  const toggleGolden = () => {
    setGoldenHour((current) => {
      engineRef.current?.setGoldenHour(!current)
      return !current
    })
  }

  const featuredWork = featuredWorks.find((work) => work.id === featuredId)
  const featuredTitle = featuredWork?.id === '2048' && locale === 'en'
    ? 'Hyakki Lantern City'
    : featuredWork?.title

  const caughtWork = caughtSlug ? works.find((w) => w.slug === caughtSlug) : null

  const fishingText =
    fishing === 'cast' ? t('fishingCast')
      : fishing === 'wait' ? t('fishingWait')
        : fishing === 'bite' ? t('fishingBite')
          : null

  const milestoneEntry = milestone !== null ? timeline[milestone] : null

  return (
    <div className="fixed inset-0 z-[60] bg-[#e8e6dd] text-ink">
      <canvas
        ref={canvasRef}
        tabIndex={overlayOpen ? -1 : 0}
        aria-label={locale === 'ja' ? '猫の3D世界' : '3D cat world'}
        className="absolute inset-0 h-full w-full outline-none"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, transparent 48%, rgba(27, 31, 27, 0.12) 100%), linear-gradient(to bottom, rgba(255, 248, 232, 0.08), transparent 32%, rgba(36, 40, 35, 0.05))',
        }}
      />

      {webglFailed && (
        <div className="absolute inset-0 grid place-items-center p-6">
          <div className="max-w-[420px] text-center">
            <p className="m-0 text-[14px] leading-[2] text-muted">{t('webglError')}</p>
            <Link href="/" className="cta mt-8 inline-flex">← {t('back')}</Link>
          </div>
        </div>
      )}

      {/* ---------- 常時 HUD ---------- */}
      {started && !revealing && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 md:p-6">
            <Link
              href="/"
              className="pointer-events-auto inline-flex min-h-11 items-center border border-line bg-surface/90 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-muted backdrop-blur-sm transition-colors hover:text-ink"
            >
              ← {t('back')}
            </Link>
            <div className="world-progress flex flex-col items-end gap-2">
              <div className="border border-line bg-surface/80 px-4 py-2 text-right backdrop-blur-sm">
                <span className="font-mono block text-[9px] tracking-[0.2em] text-muted">
                  {t('progress')}
                </span>
                <span className="font-display text-[17px] tracking-[0.1em]">
                  {caughtSet.size}
                  <span className="text-muted"> / {worldWorks.length}</span>
                </span>
              </div>
              <div className="border border-line bg-surface/80 px-4 py-2 text-right backdrop-blur-sm">
                <span className="font-mono block text-[9px] tracking-[0.2em] text-muted">
                  {t('questKittens')}
                </span>
                <span className="font-display text-[17px] tracking-[0.1em]">
                  {kittens.size}
                  <span className="text-muted"> / {TOTAL_KITTENS}</span>
                </span>
              </div>
            </div>
          </div>

          <nav className="world-toolbar" aria-label={t('toolsLabel')}>
            <button type="button" className="world-tool" aria-expanded={mapOpen} onClick={openMap}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16" /></svg>
              {t('mapTitle')}
            </button>
            <button type="button" className="world-tool" aria-expanded={helpOpen} onClick={() => setHelpOpen(true)}>{t('helpTitle')}</button>
            <button type="button" className="world-tool" aria-label={t('respawnLabel')} onClick={() => travel('entry')}>↺ {t('respawn')}</button>
          </nav>

          {/* 操作の手引き（入場後しばらくだけ） */}
          {showControls && !coarse && !overlayOpen && (
            <div className="pointer-events-none absolute bottom-6 left-6 z-20 border border-line bg-surface/80 px-4 py-3 backdrop-blur-sm">
              <p className="font-mono m-0 text-[10.5px] leading-[2] tracking-[0.08em] text-muted">
                {t('hintMove')}<br />
                {t('hintLook')}<br />
                {t('hintRun')}<br />
                {t('hintJump')}<br />
                {t('hintInteract')}
              </p>
            </div>
          )}

          {/* 画面下：釣り状態・調べるプロンプト */}
          <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex flex-col items-center gap-3 md:bottom-14" aria-live="polite">
            {toast && (
              <p className="m-0 border border-line bg-surface/85 px-4 py-2 font-mincho text-[13px] text-ink backdrop-blur-sm">
                {toast}
              </p>
            )}
            {fishingText && !caughtSlug && (
              <p
                className={`m-0 border px-5 py-2.5 font-mincho text-[15px] font-bold backdrop-blur-sm ${
                  fishing === 'bite'
                    ? 'animate-pulse border-accent bg-accent text-white'
                    : 'border-line bg-surface/85 text-ink'
                }`}
              >
                {fishingText}
              </p>
            )}
            {prompt && fishing === 'none' && !overlayOpen && (
              <p className="m-0 flex items-center gap-3 border border-line bg-surface/85 px-5 py-2.5 backdrop-blur-sm">
                {!coarse && (
                  <span className="border border-line px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] text-accent">
                    E
                  </span>
                )}
                <span className="font-mincho text-[14px] font-bold">{prompt.kind === 'featured' && prompt.id === '2048'
                  ? (locale === 'ja' ? '百鬼灯市の無料体験版を見る' : 'Discover the Hyakki Lantern City demo')
                  : t(PROMPT_KEYS[prompt.kind])}</span>
              </p>
            )}
          </div>

          {/* マウス未ロック時の案内 */}
          {!coarse && !locked && !overlayOpen && (
            <button
              type="button"
              onClick={() => engineRef.current?.requestLock()}
              className="absolute right-6 bottom-6 z-30 min-h-11 cursor-pointer border border-line bg-surface/80 px-4 py-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted backdrop-blur-sm transition-colors hover:text-ink"
            >
              {t('lockHint')}
            </button>
          )}

          {/* スマホ操作 */}
          {coarse && !overlayOpen && (
            <>
              <LookPad onLook={(dx, dy) => engineRef.current?.lookDelta(dx, dy)} />
              <Joystick onChange={(x, z) => engineRef.current?.setJoystick(x, z)} />
              <div className="absolute right-6 bottom-8 z-20 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => engineRef.current?.jump()}
                  className="grid h-14 w-14 place-items-center rounded-full border border-line bg-surface/70 font-mincho text-[12px] font-bold backdrop-blur-sm"
                >
                  {t('btnJump')}
                </button>
                <button
                  type="button"
                  onClick={() => engineRef.current?.interact()}
                  className={`grid h-16 w-16 place-items-center rounded-full border font-mincho text-[12px] font-bold backdrop-blur-sm transition-colors ${
                    prompt || fishing === 'bite' || fishing === 'wait'
                      ? 'border-accent bg-accent/90 text-white'
                      : 'border-line bg-surface/60 text-muted'
                  }`}
                >
                  {t('interact')}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* ---------- 揭晓：この島は猫のかたち ---------- */}
      {revealing && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-[560px] border border-line bg-surface/90 p-6 backdrop-blur-md md:p-8">
            <p className="font-mincho m-0 text-[clamp(22px,3.4vw,36px)] font-extrabold leading-[1.45] text-ink">
              {t('revealTitle')}
            </p>
            <p className="m-0 mt-4 max-w-[42ch] text-[13.5px] leading-[2] text-muted">
              {t('revealBody')}
            </p>
          </div>
        </div>
      )}

      {/* ---------- 会話 ---------- */}
      {dialogue && (
        <div
          className="absolute inset-0 z-40 flex cursor-pointer items-end justify-center p-4 pb-10 md:pb-16"
          onClick={advanceDialogue}
        >
          <div className="w-full max-w-[620px] border border-line bg-surface/95 p-6 backdrop-blur-md md:p-7">
            <p className="font-mono m-0 text-[10px] tracking-[0.22em] text-accent">{dialogue.name}</p>
            <p className="font-mincho m-0 mt-3 min-h-[3.6em] text-[15.5px] leading-[2] text-ink">
              {dialogue.lines[dialogue.index]}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
                {dialogue.index + 1} / {dialogue.lines.length}
              </span>
              <span className="font-mono animate-pulse text-[10px] tracking-[0.14em] text-muted">
                {dialogue.index + 1 >= dialogue.lines.length ? t('dialogueClose') : t('dialogueNext')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- 年輪の道の石碑 ---------- */}
      {milestone !== null && (
        <div
          className="absolute inset-0 z-40 flex cursor-pointer items-center justify-center p-4"
          onClick={() => setMilestone(null)}
        >
          <div className="w-full max-w-[460px] border border-line bg-surface/95 p-7 text-center backdrop-blur-md">
            <p className="font-display m-0 text-[clamp(34px,7vw,54px)] leading-none tracking-[0.06em] text-accent">
              {milestoneEntry ? milestoneEntry.year : t('milestoneFutureYear')}
            </p>
            <h2 className="font-mincho m-0 mt-4 text-[19px] font-extrabold">
              {milestoneEntry ? milestoneEntry.title[locale] : t('milestoneFutureTitle')}
            </h2>
            <p className="m-0 mt-3 text-[13.5px] leading-[2] text-muted">
              {milestoneEntry ? milestoneEntry.body[locale] : t('milestoneFutureBody')}
            </p>
            <p className="font-mono m-0 mt-6 text-[10px] tracking-[0.16em] text-muted">
              {t('dialogueClose')}
            </p>
          </div>
        </div>
      )}

      {/* ---------- 釣果カード ---------- */}
      {caughtWork && (
        <div className="absolute inset-0 z-40 overflow-y-auto bg-[#1c1a1733] p-4 py-10 md:grid md:place-items-center">
          <div
            className={`mx-auto border border-line bg-surface/95 p-6 backdrop-blur-md transition-[max-width] duration-300 md:p-8 ${
              caseOpen ? 'max-w-[720px]' : 'max-w-[560px]'
            }`}
          >
            <p className="font-mono m-0 flex items-center gap-3 text-[10px] tracking-[0.24em] text-accent">
              {t('caughtTitle')}
              <span className="border border-line px-1.5 py-0.5 text-muted">{caughtWork.tag}</span>
              <span className="text-muted">{caughtWork.year}</span>
            </p>
            <h2 className="font-mincho m-0 mt-3 text-[clamp(22px,4vw,30px)] font-extrabold">
              {caughtWork.title}
            </h2>
            <p className="m-0 mt-3 text-[13.5px] leading-[1.9] text-muted">
              {caughtWork.summary[locale]}
            </p>
            {caughtWork.tech && (
              <p className="font-mono m-0 mt-4 flex flex-wrap gap-2 text-[10px] tracking-[0.08em] text-muted">
                {caughtWork.tech.slice(0, 6).map((item) => (
                  <span key={item} className="border border-line-soft px-2 py-1">{item}</span>
                ))}
              </p>
            )}

            {caseOpen && caughtWork.caseStudy && (
              <div className="mt-6 flex flex-col gap-5 border-t border-line-soft pt-6">
                {(
                  [
                    ['problem', caughtWork.caseStudy.problem],
                    ['challenge', caughtWork.caseStudy.challenge],
                    ['solution', caughtWork.caseStudy.solution],
                    ['result', caughtWork.caseStudy.result],
                  ] as const
                ).map(([key, value]) => (
                  <div key={key}>
                    <h3 className="font-mono m-0 mb-1.5 text-[10px] tracking-[0.2em] text-accent">
                      {caseT(key)}
                    </h3>
                    <p className="m-0 text-[13px] leading-[1.9] text-muted">{value[locale]}</p>
                  </div>
                ))}
                {caughtWork.caseStudy.highlights && (
                  <ul className="m-0 flex flex-wrap gap-2 p-0">
                    {caughtWork.caseStudy.highlights.map((h) => (
                      <li
                        key={h.en}
                        className="list-none border border-line-soft px-2.5 py-1.5 font-mono text-[10.5px] text-ink"
                      >
                        {h[locale]}
                      </li>
                    ))}
                  </ul>
                )}
                {caughtWork.gallery && caughtWork.gallery.length > 0 && (
                  <div>
                    <h3 className="font-mono m-0 mb-2 text-[10px] tracking-[0.2em] text-accent">
                      {caseT('gallery')}
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {caughtWork.gallery.map((img) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img.src}
                          src={img.src}
                          alt={img.alt[locale]}
                          loading="lazy"
                          className="h-[130px] w-auto shrink-0 border border-line-soft object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {caughtWork.caseStudy && !caseOpen && (
                <button type="button" onClick={() => setCaseOpen(true)} className="cta !px-5 !py-3 text-[12px]">
                  {t('caughtMore')}
                </button>
              )}
              {caseOpen && (
                <button
                  type="button"
                  onClick={() => setCaseOpen(false)}
                  className="border border-line px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-muted transition-colors hover:text-ink"
                >
                  {t('caughtCollapse')}
                </button>
              )}
              {caughtWork.links?.repo && (
                <a
                  href={caughtWork.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-line px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-muted transition-colors hover:text-ink"
                >
                  {worksT('repo')} ↗
                </a>
              )}
              {(caughtWork.links?.demo || caughtWork.links?.itch) && (
                <a
                  href={caughtWork.links.demo ?? caughtWork.links.itch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-line px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-muted transition-colors hover:text-ink"
                >
                  {caughtWork.links.demo ? worksT('demo') : worksT('itch')} ↗
                </a>
              )}
              <button
                type="button"
                onClick={closeCaught}
                className="ml-auto cursor-pointer border-0 bg-transparent p-2 font-mono text-[11px] tracking-[0.14em] text-muted underline-offset-4 hover:underline"
              >
                {t('caughtRelease')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- 建物パネル ---------- */}
      {panel && (
        <div className="absolute inset-0 z-40 flex justify-end bg-[#1c1a1733]" onClick={() => setPanel(null)}>
          <aside
            className="h-full w-full max-w-[440px] overflow-y-auto border-l border-line bg-surface p-7 md:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-mincho m-0 text-[20px] font-extrabold">{t(PANEL_TITLE_KEYS[panel])}</h2>
              <button
                type="button"
                onClick={() => setPanel(null)}
                className="cursor-pointer border border-line bg-transparent px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-muted hover:text-ink"
              >
                {t('close')} ✕
              </button>
            </div>

            {panel === 'skills' && (
              <div className="flex flex-col gap-6">
                {skills.map((cat) => (
                  <div key={cat.category.en}>
                    <h3 className="font-mincho m-0 mb-2 text-[14px] font-bold text-accent">
                      {cat.category[locale]}
                    </h3>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0">
                      {cat.items.map((item) => (
                        <li key={item.name} className="border border-line-soft p-3">
                          <span className="font-mono block text-[12px] tracking-[0.06em]">{item.name}</span>
                          <span className="mt-1 block text-[11.5px] text-muted">{item.note[locale]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {panel === 'about' && (
              <div className="flex flex-col gap-6 text-[13.5px] leading-[1.9]">
                <p className="m-0 text-muted">{pr[locale]}</p>
                <ol className="tl m-0">
                  {timeline.map((item) => (
                    <li key={item.title.en}>
                      <span className="font-mono text-[11px] tracking-[0.2em] text-accent">{item.year}</span>
                      <h3 className="font-mincho m-0 mt-1 text-[15px] font-bold">{item.title[locale]}</h3>
                      <p className="m-0 mt-0.5 text-[12.5px] text-muted">{item.body[locale]}</p>
                    </li>
                  ))}
                </ol>
                <ul className="m-0 flex list-none flex-col gap-1.5 border-t border-line-soft p-0 pt-4">
                  {languages.map((lang) => (
                    <li key={lang.name.en} className="flex items-baseline gap-3">
                      <span className="font-mincho font-bold">{lang.name[locale]}</span>
                      <span className="text-[12px] text-muted">{lang.level[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {panel === 'contact' && (
              <div className="flex flex-col gap-4">
                <a href={`mailto:${email}`} className="cta !px-5 !py-3.5 text-[12px]">✉ {email}</a>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-line px-5 py-3.5 font-mono text-[12px] tracking-[0.12em] text-muted transition-colors hover:text-ink"
                >
                  GitHub ↗
                </a>
              </div>
            )}
          </aside>
        </div>
      )}

      {mapOpen && <WorldDialog title={t('mapTitle')} kicker="NEKO WORLD / FIELD GUIDE" closeLabel={t('close')} onClose={() => setMapOpen(false)}>
        <WorldMap position={position} onTravel={travel} />
      </WorldDialog>}

      {helpOpen && <WorldDialog title={t('helpTitle')} kicker="MAKE YOURSELF AT HOME" closeLabel={t('close')} onClose={() => setHelpOpen(false)}>
        <div className="world-help-grid">
          <div><p className="whitespace-pre-line">{coarse ? t('introControlsTouch') : t('introControlsPc')}</p></div>
          <div><p>{t('helpNavigation')}</p></div>
        </div>
        <div className="world-settings">
          <button type="button" className="world-tool" aria-pressed={goldenHour} onClick={toggleGolden}>{goldenHour ? t('settingEvening') : t('settingDay')}</button>
          <button type="button" className="world-tool" aria-pressed={lowPower} onClick={() => {
            engineRef.current?.setLowPower(!lowPower)
            setLowPower(!lowPower)
          }}>{lowPower ? t('qualityLight') : t('qualityFull')}</button>
          <button type="button" className="world-tool" aria-pressed={reducedMotion} onClick={() => {
            engineRef.current?.setReducedMotion(!reducedMotion)
            setReducedMotion(!reducedMotion)
          }}>{reducedMotion ? t('motionReduced') : t('motionFull')}</button>
        </div>
        <p className="world-help-note">{t('helpSettingsNote')}</p>
      </WorldDialog>}

      {featuredWork && <WorldDialog title={featuredTitle ?? featuredWork.title} kicker={`FEATURED PROJECT / ${featuredWork.index}`} closeLabel={t('close')} onClose={() => setFeaturedId(null)}>
        <span className="world-featured-status">{featuredWork.status === 'LIVE'
          ? featuredWork.releaseLabel[locale]
          : t('featuredInProgress')}</span>
        <p className="world-featured-copy">{featuredWork.summary[locale]}</p>
        <p className="world-featured-note">{featuredWork.note[locale]}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          {featuredWork.slug && <Link href={`/works/${featuredWork.slug}`} className="cta !px-5 !py-3 text-[12px]">
            {locale === 'ja' ? 'ゲーム・作品紹介へ' : 'Play & project details'} →
          </Link>}
          <button type="button" className="world-tool" onClick={() => setFeaturedId(null)}>{t('continueExploring')} →</button>
        </div>
      </WorldDialog>}

      {arrival > 0 && <div key={arrival} className="world-arrival" aria-hidden="true" onAnimationEnd={() => setArrival(0)} />}

      {/* ---------- 序章 ---------- */}
      {!started && !webglFailed && introStage === 'prologue' && (
        <div
          className={`absolute inset-0 grid cursor-pointer place-items-center bg-[#0b0b0d] p-6 transition-opacity duration-700 ${
            prologueVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIntroStage('ready')}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setIntroStage('ready') }
          }}
        >
          <div className="max-w-[540px] text-center">
            <p className="font-mincho m-0 text-[clamp(24px,4.4vw,38px)] font-bold leading-[1.6] text-[#f0ede4]">
              {t('prologueLine')}
            </p>
            <p className="m-0 mx-auto mt-6 max-w-[36ch] text-[13.5px] leading-[2] text-[#f0ede4]/60">
              {t('prologueSub')}
            </p>
          </div>
        </div>
      )}

      {/* ---------- 準備画面 ---------- */}
      {!started && !webglFailed && introStage === 'ready' && (
        <div className="absolute inset-0 grid place-items-center bg-[#f4ecddb3] p-6 backdrop-blur-[1px]">
          <div className="max-w-[540px] text-center">
            <p className="font-mono m-0 text-[10px] tracking-[0.3em] text-accent">{t('introKicker')}</p>
            <h1 className="font-mincho m-0 mt-4 text-[clamp(40px,9vw,72px)] font-extrabold leading-none">
              {t('introTitle')}
            </h1>
            <p className="m-0 mx-auto mt-6 max-w-[40ch] text-[14px] leading-[2] text-muted">
              {t('introBody')}
            </p>
            <div className="mx-auto mt-7 max-w-[30ch] border-y border-line-soft py-4">
              <p className="font-mono m-0 text-[11px] leading-[2.1] tracking-[0.1em] whitespace-pre-line text-ink/80">
                {coarse ? t('introControlsTouch') : t('introControlsPc')}
              </p>
            </div>
            {coarse && (
              <p className="font-mono m-0 mt-3 text-[10px] tracking-[0.14em] text-muted">
                {t('introNote')}
              </p>
            )}
            <div className="mt-8 flex flex-col items-center gap-5">
              <button type="button" onClick={start} className="cta">{t('introStart')}</button>
              <Link
                href="/"
                className="font-mono text-[11px] tracking-[0.18em] text-muted underline-offset-4 hover:underline"
              >
                ← {t('back')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function WorldDialog({ title, kicker, closeLabel, onClose, children }: {
  title: string
  kicker: string
  closeLabel: string
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    dialog?.querySelector<HTMLButtonElement>('button')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return }
      if (event.key !== 'Tab' || !dialog) return
      const items = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]'))
      const first = items[0]
      const last = items.at(-1)
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous?.isConnected) previous.focus()
    }
  }, [])

  return (
    <div className="world-modal-backdrop" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="world-dialog">
        <div className="world-dialog-head">
          <div><p className="world-dialog-kicker">{kicker}</p><h2 id={titleId}>{title}</h2></div>
          <button type="button" className="world-dialog-close" aria-label={closeLabel} onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---------- スマホ：視点ドラッグ ---------- */

function LookPad({ onLook }: { onLook: (dx: number, dy: number) => void }) {
  const last = useRef<{ x: number; y: number } | null>(null)
  return (
    <div
      className="absolute inset-0 z-10 touch-none"
      onPointerDown={(event) => {
        last.current = { x: event.clientX, y: event.clientY }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (!last.current) return
        onLook(event.clientX - last.current.x, event.clientY - last.current.y)
        last.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={() => {
        last.current = null
      }}
      onPointerCancel={() => {
        last.current = null
      }}
    />
  )
}

/* ---------- スマホ：仮想スティック ---------- */

function Joystick({ onChange }: { onChange: (x: number, z: number) => void }) {
  const knobRef = useRef<HTMLDivElement>(null)
  const active = useRef(false)

  const handle = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    let dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    let dz = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    const len = Math.hypot(dx, dz)
    if (len > 1) {
      dx /= len
      dz /= len
    }
    onChange(dx, dz)
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx * 30}px, ${dz * 30}px)`
  }

  const stop = () => {
    active.current = false
    onChange(0, 0)
    if (knobRef.current) knobRef.current.style.transform = 'translate(0,0)'
  }

  return (
    <div
      className="absolute bottom-8 left-6 z-20 h-28 w-28 touch-none rounded-full border border-line bg-surface/50 backdrop-blur-sm"
      onPointerDown={(event) => {
        active.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        event.stopPropagation()
        handle(event)
      }}
      onPointerMove={(event) => {
        event.stopPropagation()
        handle(event)
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <div
        ref={knobRef}
        className="absolute top-1/2 left-1/2 -mt-6 -ml-6 h-12 w-12 rounded-full border border-line bg-ink/20 transition-transform duration-75"
      />
    </div>
  )
}
