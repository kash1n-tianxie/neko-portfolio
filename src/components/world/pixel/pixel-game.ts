import { TOWN_MAP } from './town-map'
import { createWorldState, stepWorld, nudgeWorld, interactWorld, closeInteraction, openDiscovered, setDestination, snapshotWorld } from './simulation'
import { renderPixelWorld } from './pixel-renderer'
import { fitPixelViewport, pixelCamera } from './viewport'
import { acceptsGameKeys, readMovement } from './input'
import type { PixelLocale, PixelPalette, PixelSnapshot, Point, WorldState } from './world-types'

type Callbacks = { onChange: (snapshot: PixelSnapshot) => void; onReady: () => void; onError: (error?: unknown) => void }
type Options = { locale: PixelLocale; palette: PixelPalette; reducedMotion: boolean; discovered?: string[] }
type GameWindow = Window & { render_game_to_text?: () => string; advanceTime?: (ms: number) => void }
const MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])

/** Owns browser resources only; simulation and map are deterministic, framework-free modules. */
export class PixelGame {
  private ctx: CanvasRenderingContext2D
  private state: WorldState
  private image = new Image()
  private keys = new Set<string>()
  private touch: Point = { x: 0, y: 0 }
  private camera: Point = { x: 0, y: 0 }
  private raf = 0
  private running = false
  private disposed = false
  private loaded = false
  private announced = false
  private lastTime = 0
  private lastEmit = 0
  private observer: ResizeObserver
  private assetTimeout = 0
  private previousText: GameWindow['render_game_to_text']
  private previousAdvance: GameWindow['advanceTime']

  constructor(private canvas: HTMLCanvasElement, private callbacks: Callbacks, private options: Options) {
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) throw new Error('Canvas 2D is unavailable')
    this.ctx = ctx
    this.state = createWorldState(TOWN_MAP, options.discovered)
    this.state.paused = true
    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(canvas)
    this.resize()
    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)
    window.addEventListener('blur', this.clearInput)
    document.addEventListener('visibilitychange', this.visibility)
    canvas.addEventListener('pointerdown', this.point)
    canvas.addEventListener('blur', this.clearInput)
    const gameWindow = window as GameWindow
    this.previousText = gameWindow.render_game_to_text
    this.previousAdvance = gameWindow.advanceTime
    gameWindow.render_game_to_text = this.textState
    gameWindow.advanceTime = this.advanceTime
    this.image.onload = () => {
      if (this.disposed) return
      window.clearTimeout(this.assetTimeout)
      this.loaded = true
      this.draw()
      this.emit()
    }
    this.image.onerror = () => this.fail(new Error('Town map could not load'))
    this.assetTimeout = window.setTimeout(() => this.fail(new Error('Town map timed out')), 12000)
    this.image.src = '/assets/world/pixel-town.png'
  }

  private fail = (error: unknown) => {
    if (this.disposed) return
    window.clearTimeout(this.assetTimeout)
    this.running = false
    cancelAnimationFrame(this.raf)
    this.callbacks.onError(error)
  }
  private resize = () => {
    if (this.disposed) return
    const box = this.canvas.getBoundingClientRect()
    const viewport = fitPixelViewport(box.width, box.height)
    this.canvas.width = viewport.width
    this.canvas.height = viewport.height
    this.camera = pixelCamera(this.state.player, viewport.width, viewport.height, TOWN_MAP.width, TOWN_MAP.height)
    this.draw()
  }
  private clearInput = () => {
    this.keys.clear()
    this.touch = { x: 0, y: 0 }
    this.state.player.vx = 0; this.state.player.vy = 0; this.state.player.moving = false
    this.state.path = []
  }
  private visibility = () => { this.clearInput(); this.lastTime = 0 }
  private keyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null
    if (!target || !acceptsGameKeys(target.tagName, target.isContentEditable) || this.state.paused) return
    if (MOVE_KEYS.has(event.code)) { event.preventDefault(); this.keys.add(event.code); return }
    if ((event.code === 'KeyE' || event.code === 'Space') && !event.repeat) { event.preventDefault(); this.interact() }
    if (event.code === 'Escape') { this.close(); event.preventDefault() }
    if (event.code === 'KeyF' && !event.repeat) {
      event.preventDefault()
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
      else void this.canvas.parentElement?.requestFullscreen?.().catch(() => {})
    }
  }
  private keyUp = (event: KeyboardEvent) => { this.keys.delete(event.code) }
  private point = (event: PointerEvent) => {
    if (event.button !== 0 || this.state.paused || !this.loaded) return
    this.canvas.focus({ preventScroll: true })
    const rect = this.canvas.getBoundingClientRect()
    const point = {
      x: (event.clientX - rect.left) / rect.width * this.canvas.width + this.camera.x,
      y: (event.clientY - rect.top) / rect.height * this.canvas.height + this.camera.y,
    }
    // Tap the minimap to choose a destination using the same collision-aware routing.
    const mw = this.canvas.width < 260 ? 60 : 92, mh = Math.round(mw * 2 / 3)
    const mx = this.canvas.width - mw - 8, my = this.canvas.width < 260 ? 43 : 30
    const sx = point.x - this.camera.x, sy = point.y - this.camera.y
    if (sx >= mx && sx <= mx + mw && sy >= my && sy <= my + mh) {
      point.x = (sx - mx) / mw * TOWN_MAP.width
      point.y = (sy - my) / mh * TOWN_MAP.height
    }
    setDestination(this.state, point, TOWN_MAP)
    this.emit()
  }
  private loop = (now: number) => {
    if (!this.running || this.disposed) return
    const dt = this.lastTime ? Math.min(.05, (now - this.lastTime) / 1000) : 1 / 60
    this.lastTime = now
    if (!document.hidden) {
      stepWorld(this.state, readMovement(this.keys, this.touch), dt, TOWN_MAP)
      this.draw()
      if (now - this.lastEmit > 80) { this.emit(); this.lastEmit = now }
    }
    this.raf = requestAnimationFrame(this.loop)
  }
  private draw() {
    if (!this.loaded || this.disposed) return
    const next = pixelCamera(this.state.player, this.canvas.width, this.canvas.height, TOWN_MAP.width, TOWN_MAP.height)
    this.camera = next
    try {
      renderPixelWorld(this.ctx, this.image, this.state, TOWN_MAP, this.camera, this.options.palette, this.options.locale, this.options.reducedMotion)
      if (!this.announced) { this.announced = true; this.callbacks.onReady() }
    } catch (error) { this.fail(error) }
  }
  private emit() { if (!this.disposed) this.callbacks.onChange(this.snapshot()) }
  private textState = () => JSON.stringify({ coordinateSystem: 'native map pixels; origin top-left; x right, y down', ...this.snapshot(), camera: this.camera, visibleSpots: TOWN_MAP.spots.map(({ id, kind, x, y }) => ({ id, kind, x, y })) })
  private advanceTime = (ms: number) => {
    if (!Number.isFinite(ms) || ms <= 0 || this.disposed) return
    const count = Math.ceil(Math.min(ms, 10000) / (1000 / 60))
    for (let i = 0; i < count; i++) stepWorld(this.state, readMovement(this.keys, this.touch), 1 / 60, TOWN_MAP)
    this.draw(); this.emit()
  }

  play() { if (this.running || this.disposed) return; this.running = true; this.lastTime = 0; this.raf = requestAnimationFrame(this.loop) }
  setPaused(paused: boolean) { this.state.paused = paused; if (paused) this.clearInput(); this.emit() }
  move(x: number, y: number) { this.touch = { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 }; if (x || y) this.state.path = [] }
  nudge(x: number, y: number) { this.clearInput(); nudgeWorld(this.state, { x, y }, TOWN_MAP); this.emit(); this.draw() }
  interact() { this.clearInput(); interactWorld(this.state, TOWN_MAP); this.emit(); this.draw() }
  close() { this.clearInput(); closeInteraction(this.state); this.emit(); this.draw() }
  openEntry(id: string) { this.clearInput(); openDiscovered(this.state, id, TOWN_MAP); this.emit() }
  setPalette(palette: PixelPalette) { this.options.palette = palette; this.draw() }
  setReducedMotion(reduced: boolean) { this.options.reducedMotion = reduced; this.draw() }
  snapshot() { return snapshotWorld(this.state) }
  dispose() {
    if (this.disposed) return
    this.disposed = true; this.running = false
    cancelAnimationFrame(this.raf); window.clearTimeout(this.assetTimeout)
    this.observer.disconnect()
    window.removeEventListener('keydown', this.keyDown); window.removeEventListener('keyup', this.keyUp)
    window.removeEventListener('blur', this.clearInput); document.removeEventListener('visibilitychange', this.visibility)
    this.canvas.removeEventListener('pointerdown', this.point); this.canvas.removeEventListener('blur', this.clearInput)
    this.image.onload = null; this.image.onerror = null
    const gameWindow = window as GameWindow
    if (gameWindow.render_game_to_text === this.textState) gameWindow.render_game_to_text = this.previousText
    if (gameWindow.advanceTime === this.advanceTime) gameWindow.advanceTime = this.previousAdvance
  }
}
