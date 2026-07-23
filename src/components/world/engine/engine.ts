import * as THREE from 'three'
import { COLORS, toonMat } from './materials'
import { animateCat, buildCat, type CatPose, type CatRig } from './cat'
import {
  STEP_UP,
  buildClouds,
  buildIsland,
  buildMotes,
  buildMounds,
  buildSky,
  groundHeightAt,
  islandField,
} from './island'
import {
  FISHING_SPOT,
  NAP_SPOT,
  PIER,
  POND,
  buildButterfly,
  buildEngawa,
  buildFish,
  buildHut,
  buildKitten,
  buildLantern,
  buildMilestone,
  buildNapSpot,
  buildPier,
  buildPond,
  buildScatter,
  buildSignpost,
  buildStatue,
  buildTorii,
  buildTower,
  buildViewpoint,
  buildWindChime,
  type Butterfly,
  type Fish,
  type FishTag,
} from './props'
import { animateNpc, buildAgent, buildNpcCat, type Npc } from './npc'

export type InteractKind =
  | 'fish' | 'skills' | 'about' | 'contact' | 'exit'
  | 'npc' | 'kitten' | 'viewpoint' | 'milestone'

export type PromptTarget = { kind: InteractKind; id: string; index?: number }
export type FishingPhase = 'none' | 'cast' | 'wait' | 'bite' | 'reel' | 'caught'
export type FishingNote = 'early' | undefined

export type WorldCallbacks = {
  onPrompt: (target: PromptTarget | null) => void
  onFishing: (phase: FishingPhase, note?: FishingNote) => void
  onCatch: (slug: string) => void
  onPanel: (panel: 'skills' | 'about' | 'contact') => void
  onExit: () => void
  onTalk: (npcId: string) => void
  onKitten: (id: string) => void
  onMilestone: (index: number) => void
  onReveal: (active: boolean) => void
  onPointerLock: (locked: boolean) => void
}

type Interactable = PromptTarget & {
  x: number
  z: number
  y: number
  r: number
  object?: THREE.Object3D
  taken?: boolean
}

const MOVE_KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1], ArrowUp: [0, -1],
  KeyS: [0, 1], ArrowDown: [0, 1],
  KeyA: [-1, 0], ArrowLeft: [-1, 0],
  KeyD: [1, 0], ArrowRight: [1, 0],
}

const WALK_SPEED = 4.6
const RUN_SPEED = 9.2
const GRAVITY = 24
const JUMP_V = 9
const EDGE_MARGIN = 1.6
/** 出生地は島の南端。ここから北を向くと、鳥居以外の全区画が前方に並ぶ */
const SPAWN = { x: 0, z: 27 }
const SPAWN_HEADING = Math.PI / 2 // 北（-z）を向く

/** 昼と、子猫を全員見つけたあとの黄昏 */
const DAY = {
  sun: new THREE.Color(0xfff2da),
  sunI: 2.25,
  amb: new THREE.Color(0xfff6e6),
  ambI: 0.48,
  hemiSky: new THREE.Color(0xd9ebfb),
  hemiGround: new THREE.Color(0x69765b),
  hemiI: 1.25,
  fog: new THREE.Color(COLORS.fog),
  skyTop: new THREE.Color(COLORS.skyTop),
  skyBottom: new THREE.Color(COLORS.skyBottom),
}
const GOLDEN = {
  sun: new THREE.Color(0xffcf92),
  sunI: 2.15,
  amb: new THREE.Color(0xffe6cb),
  ambI: 0.52,
  hemiSky: new THREE.Color(0xffd8b0),
  hemiGround: new THREE.Color(0x78624c),
  hemiI: 1.05,
  fog: new THREE.Color(0xf6e0c4),
  skyTop: new THREE.Color(0x9db6cf),
  skyBottom: new THREE.Color(0xffdcae),
}

function shuffle<T>(list: T[]): T[] {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export class NekoWorld {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private clock = new THREE.Clock()
  private raf = 0
  private disposed = false
  private canvas: HTMLCanvasElement

  private cat: CatRig
  private heading = SPAWN_HEADING
  private velY = 0
  private grounded = true
  private moving = false
  private running = false
  private keys = new Set<string>()
  private joystick = { x: 0, z: 0 }
  private uiOpen = true
  private started = false

  // 追従カメラ（軌道）
  private yaw = 0.46
  private pitch = 0.26
  private dist = 7.4
  private locked = false

  private prompt: Interactable | null = null
  private interactables: Interactable[] = []
  private colliders: [number, number, number][] = []

  private fishingPhase: FishingPhase = 'none'
  private fishingT = 0
  private waitDuration = 0
  private bobber: THREE.Mesh
  private bobberFrom = new THREE.Vector3()
  private bobberTarget = new THREE.Vector3()
  private line: THREE.Line
  private linePositions = new Float32Array(6)

  private fishes: Fish[] = []
  private queue: string[] = []
  private caughtSet = new Set<string>()

  private ripples: { mesh: THREE.Mesh; life: number }[] = []
  private motes: THREE.Points
  private motePhase: Float32Array

  private sunlight: THREE.DirectionalLight
  private ambient: THREE.AmbientLight
  private hemisphere: THREE.HemisphereLight
  private sunTarget = new THREE.Object3D()
  private skyMat: THREE.ShaderMaterial
  private golden = 0
  private goldenTarget = 0

  private npcs: Npc[] = []
  private butterflies: Butterfly[] = []
  private chimeSwing!: THREE.Group
  private chimePos = new THREE.Vector3()
  private napTimer = 0
  private napping = false

  private reveal = { active: false, t: 0 }
  private revealFrom = new THREE.Vector3()

  constructor(
    canvas: HTMLCanvasElement,
    works: { slug: string; tag: FishTag }[],
    private callbacks: WorldCallbacks,
  ) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(this.pixelRatio())
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.06
    this.renderer.setClearColor(COLORS.skyBottom)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene.fog = new THREE.Fog(DAY.fog.getHex(), 70, 260)
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 700)

    this.ambient = new THREE.AmbientLight(DAY.amb.getHex(), DAY.ambI)
    this.scene.add(this.ambient)
    this.hemisphere = new THREE.HemisphereLight(DAY.hemiSky, DAY.hemiGround, DAY.hemiI)
    this.scene.add(this.hemisphere)
    this.sunlight = new THREE.DirectionalLight(DAY.sun.getHex(), DAY.sunI)
    this.sunTarget.position.set(SPAWN.x, 0, SPAWN.z)
    this.sunlight.position.set(SPAWN.x + 34, 46, SPAWN.z + 26)
    this.sunlight.target = this.sunTarget
    this.sunlight.castShadow = true
    this.sunlight.shadow.mapSize.set(2048, 2048)
    this.sunlight.shadow.camera.left = -20
    this.sunlight.shadow.camera.right = 20
    this.sunlight.shadow.camera.top = 20
    this.sunlight.shadow.camera.bottom = -20
    this.sunlight.shadow.camera.near = 0.5
    this.sunlight.shadow.camera.far = 120
    this.sunlight.shadow.bias = -0.0005
    this.sunlight.shadow.normalBias = 0.035
    this.scene.add(this.sunTarget, this.sunlight)
    const rimLight = new THREE.DirectionalLight(0xdcecff, 0.5)
    rimLight.position.set(-24, 18, -18)
    this.scene.add(rimLight)

    const sky = buildSky()
    this.skyMat = sky.material
    this.scene.add(sky.mesh)
    this.scene.add(buildClouds())
    this.scene.add(buildIsland(), buildMounds(), buildPond(), buildPier(), buildNapSpot())

    const motes = buildMotes()
    this.motes = motes.points
    this.motePhase = motes.phase
    this.scene.add(this.motes)

    const scatter = buildScatter()
    this.scene.add(scatter.group)
    this.colliders = [...scatter.colliders]

    this.placeWorld()

    // 主人公
    this.cat = buildCat()
    this.cat.root.position.set(SPAWN.x, 0, SPAWN.z)
    this.cat.root.rotation.y = this.heading
    this.scene.add(this.cat.root)

    // 釣り具
    this.bobber = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), toonMat(COLORS.accent).clone())
    this.bobber.visible = false
    this.scene.add(this.bobber)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3))
    this.line = new THREE.Line(
      lineGeo,
      new THREE.LineBasicMaterial({ color: COLORS.ink, transparent: true, opacity: 0.7 }),
    )
    this.line.frustumCulled = false
    this.line.visible = false
    this.scene.add(this.line)

    const rippleGeo = new THREE.RingGeometry(0.86, 1, 24)
    for (let i = 0; i < 8; i += 1) {
      const ring = new THREE.Mesh(
        rippleGeo,
        new THREE.MeshBasicMaterial({ color: COLORS.pale, transparent: true, opacity: 0, depthWrite: false }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.y = POND.surfaceY + 0.02
      ring.visible = false
      this.scene.add(ring)
      this.ripples.push({ mesh: ring, life: 1 })
    }

    // 作品＝池を泳ぐ魚。未読キューから順に釣れるので必ず全部見られる
    works.forEach((work, i) => {
      const fish = buildFish(work.slug, work.tag, i, works.length)
      this.fishes.push(fish)
      this.scene.add(fish.group)
    })
    this.queue = shuffle(works.map((w) => w.slug))

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('resize', this.onResize)
    window.addEventListener('blur', this.onBlur)
    canvas.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
    canvas.addEventListener('wheel', this.onWheel, { passive: false })
    document.addEventListener('pointerlockchange', this.onLockChange)
  }

  /* ---------- 世界を組み立てる ---------- */

  private add(object: THREE.Object3D, x: number, z: number, y = 0, rotY = 0) {
    object.position.set(x, y, z)
    object.rotation.y = rotY
    this.scene.add(object)
    return object
  }

  private interactable(item: Interactable) {
    this.interactables.push(item)
    return item
  }

  private placeWorld() {
    // 出生地の広場（島の南端、鳥居をくぐった内側）
    this.add(buildStatue(), -3.8, 28.5, 0, 0.5)
    this.colliders.push([-3.8, 28.5, 1.1])
    this.add(buildSignpost(), 3.4, 25.6)
    this.colliders.push([3.4, 25.6, 0.4])

    // 工房（技術）
    this.add(buildHut(), 13, 15, 0, Math.atan2(-13, 12))
    this.colliders.push([13, 15, 2.9])
    this.interactable({ kind: 'skills', id: 'skills', x: 11.6, z: 17.4, y: 0, r: 3 })

    // 縁側（経歴）。掛け軸は正面（+z）から読む
    this.add(buildEngawa(), -15, -2)
    this.colliders.push([-15, -2.2, 2])
    this.interactable({ kind: 'about', id: 'about', x: -15, z: 0, y: 0, r: 2.8 })

    // 研究塔（卒業研究）
    this.add(buildTower(), 15, -9)
    this.colliders.push([15, -9, 2.6])

    // 灯籠と郵便受け（連絡）。南北の参道を塞がないよう西へ寄せる
    this.add(buildLantern(), -5.4, -21)
    this.colliders.push([-5.4, -21, 0.95], [-3.7, -20.5, 0.5])
    this.interactable({ kind: 'contact', id: 'contact', x: -4.3, z: -19.2, y: 0, r: 2.6 })

    // 展望台（島の正体が分かる場所）
    this.add(buildViewpoint(), 0, -38, 2.5)
    this.interactable({ kind: 'viewpoint', id: 'viewpoint', x: 0, z: -38, y: 2.74, r: 2.6 })

    // 鳥居（2Dへ戻る）。唯一、出生地の背後にある
    this.add(buildTorii(), 0, 37)
    this.colliders.push([-2.1, 37, 0.45], [2.1, 37, 0.45])
    this.interactable({ kind: 'exit', id: 'exit', x: 0, z: 35, y: 0, r: 2.8 })

    // 釣り場
    this.interactable({ kind: 'fish', id: 'fish', x: FISHING_SPOT.x, z: FISHING_SPOT.z, y: PIER.deckY, r: 2.4 })

    // 年輪の道＝尻尾。歩いた分だけ時間が進む
    const milestones: [number, number][] = [[32.5, 26.5], [36, 22.5], [38.8, 18], [40.2, 13]]
    milestones.forEach(([x, z], i) => {
      this.add(buildMilestone(), x, z, 0, Math.atan2(-x, -z))
      this.colliders.push([x, z, 0.75])
      this.interactable({ kind: 'milestone', id: `milestone-${i}`, index: i, x, z, y: 0, r: 2.5 })
    })

    // 迷子の子猫（耳の上・尻尾の先・池のほとり）
    const kittens: [string, number, number, number][] = [
      ['ear', -9.5, -47, 3.6],
      ['tail', 38.5, -1, 0],
      ['pond', -17, 10, 0],
    ]
    for (const [id, x, z, y] of kittens) {
      const model = this.add(buildKitten(), x, z, y, Math.atan2(-x, -z))
      this.interactable({ kind: 'kitten', id, x, z, y, r: 2, object: model })
    }

    // NPC。案内役は出生地のすぐ前方に立たせる
    const guide = buildNpcCat('guide', 0xf1ece0, 1.75)
    this.add(guide.group, 3, 23.4, 0, Math.atan2(-3, 3.6))
    this.npcs.push(guide)
    this.colliders.push([3, 23.4, 0.6])
    this.interactable({ kind: 'npc', id: 'guide', x: 3, z: 23.4, y: 0, r: 2.4 })

    const junior = buildNpcCat('junior', 0x8a7b63, 1.75)
    this.add(junior.group, 11, -3, 0, Math.atan2(-11, 3))
    this.npcs.push(junior)
    this.colliders.push([11, -3, 0.6])
    this.interactable({ kind: 'npc', id: 'junior', x: 11, z: -3, y: 0, r: 2.4 })

    const agent = buildAgent('agent')
    this.add(agent.group, 17.6, -12.6)
    this.npcs.push(agent)
    this.colliders.push([17.6, -12.6, 0.7])
    this.interactable({ kind: 'npc', id: 'agent', x: 17.6, z: -12.6, y: 0, r: 2.6 })

    // 風鈴と蝶
    const chime = buildWindChime()
    this.add(chime.group, -12.6, -9.4)
    this.chimeSwing = chime.swing
    this.chimePos.set(-12.6, 0, -9.4)
    this.colliders.push([-12.6, -9.4, 0.35])

    const spots: [number, number][] = [[-9, 19], [-14, 11], [3, 13], [9, 4]]
    spots.forEach(([x, z], i) => {
      const b = buildButterfly(x, z, i * 1.7)
      this.butterflies.push(b)
      this.scene.add(b.group)
    })
  }

  /* ---------- 公開 API ---------- */

  start() {
    this.started = true
    this.uiOpen = false
    this.requestLock()
  }

  setUIOpen(open: boolean) {
    this.uiOpen = open
    if (open) {
      this.keys.clear()
      this.joystick.x = 0
      this.joystick.z = 0
      this.running = false
      if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    }
  }

  setJoystick(x: number, z: number) {
    this.joystick.x = x
    this.joystick.z = z
  }

  setRunning(on: boolean) {
    this.running = on
  }

  lookDelta(dx: number, dy: number) {
    this.yaw -= dx * 0.006
    this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.004, -0.15, 1.15)
  }

  requestLock() {
    if (this.uiOpen || this.reveal.active) return
    try {
      const result = this.canvas.requestPointerLock() as unknown as Promise<void> | undefined
      if (result?.catch) result.catch(() => {})
    } catch {
      /* ポインターロックが使えない環境ではドラッグ操作にフォールバック */
    }
  }

  interact() {
    this.interactPress()
  }

  jump() {
    if (this.uiOpen || this.reveal.active || !this.grounded) return
    this.velY = JUMP_V
    this.grounded = false
  }

  releaseFish() {
    if (this.fishingPhase === 'caught') this.stopFishing()
  }

  setGoldenHour(on: boolean) {
    this.goldenTarget = on ? 1 : 0
  }

  run() {
    const tick = () => {
      if (this.disposed) return
      const dt = Math.min(this.clock.getDelta(), 0.05)
      this.update(dt, this.clock.elapsedTime)
      this.renderer.render(this.scene, this.camera)
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('blur', this.onBlur)
    this.canvas.removeEventListener('mousedown', this.onMouseDown)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('mouseup', this.onMouseUp)
    this.canvas.removeEventListener('wheel', this.onWheel)
    document.removeEventListener('pointerlockchange', this.onLockChange)
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry.dispose()
      }
    })
    this.renderer.dispose()
  }

  /* ---------- 入力 ---------- */

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.uiOpen || this.reveal.active) return
    if (MOVE_KEYS[event.code]) {
      event.preventDefault()
      this.keys.add(event.code)
      return
    }
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.running = true
      return
    }
    if (event.code === 'Space' && !event.repeat) {
      event.preventDefault()
      this.jump()
      return
    }
    if ((event.code === 'KeyE' || event.code === 'Enter') && !event.repeat) {
      event.preventDefault()
      this.interactPress()
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code)
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') this.running = false
  }

  private onBlur = () => {
    this.keys.clear()
    this.running = false
  }

  private pixelRatio() {
    // 3D ワールドは高密度画面での描画負荷が大きい。見た目を保ったまま端末別に上限を設ける。
    const cap = window.innerWidth < 768 ? 1.3 : 1.75
    return Math.min(window.devicePixelRatio, cap)
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(this.pixelRatio())
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private dragging = false

  private onMouseDown = (event: MouseEvent) => {
    if (this.uiOpen || this.reveal.active) return
    if (!this.locked) {
      this.requestLock()
      this.dragging = true
      event.preventDefault()
    }
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.uiOpen || this.reveal.active) return
    if (this.locked) {
      this.lookDelta(event.movementX, event.movementY)
    } else if (this.dragging) {
      this.lookDelta(event.movementX, event.movementY)
    }
  }

  private onMouseUp = () => {
    this.dragging = false
  }

  private onWheel = (event: WheelEvent) => {
    if (this.uiOpen || this.reveal.active) return
    event.preventDefault()
    this.dist = THREE.MathUtils.clamp(this.dist + event.deltaY * 0.012, 5.2, 16)
  }

  private onLockChange = () => {
    this.locked = document.pointerLockElement === this.canvas
    this.callbacks.onPointerLock(this.locked)
  }

  private interactPress() {
    if (this.uiOpen || this.reveal.active) return
    if (this.fishingPhase === 'wait') {
      this.callbacks.onFishing('wait', 'early')
      return
    }
    if (this.fishingPhase === 'bite') {
      this.fishingPhase = 'reel'
      this.fishingT = 0
      this.bobberFrom.copy(this.bobber.position)
      this.callbacks.onFishing('reel')
      return
    }
    if (this.fishingPhase !== 'none') return

    const target = this.prompt
    if (!target) return

    switch (target.kind) {
      case 'fish':
        this.startFishing()
        break
      case 'skills':
      case 'about':
      case 'contact':
        this.callbacks.onPanel(target.kind)
        break
      case 'exit':
        this.callbacks.onExit()
        break
      case 'npc':
        this.callbacks.onTalk(target.id)
        break
      case 'milestone':
        this.callbacks.onMilestone(target.index ?? 0)
        break
      case 'kitten':
        target.taken = true
        if (target.object) target.object.visible = false
        this.interactables = this.interactables.filter((i) => i !== target)
        this.prompt = null
        this.callbacks.onPrompt(null)
        this.callbacks.onKitten(target.id)
        break
      case 'viewpoint':
        this.startReveal()
        break
    }
  }

  /* ---------- 揭晓：島の正体 ---------- */

  private startReveal() {
    this.reveal.active = true
    this.reveal.t = 0
    this.revealFrom.copy(this.camera.position)
    // 上空 138 からだと通常の霧が島を覆ってしまうので、演出中だけ遠くまで晴らす
    const fog = this.scene.fog as THREE.Fog
    fog.near = 210
    fog.far = 620
    this.keys.clear()
    this.running = false
    if (document.pointerLockElement === this.canvas) document.exitPointerLock()
    this.callbacks.onReveal(true)
  }

  private updateReveal(dt: number) {
    if (!this.reveal.active) return true
    this.reveal.t += dt
    const high = new THREE.Vector3(8, 138, 26)
    const look = new THREE.Vector3(8, 0, -7)
    const rise = 2.2
    const hold = 5.4

    if (this.reveal.t < rise) {
      const k = this.easeInOut(this.reveal.t / rise)
      this.camera.position.lerpVectors(this.revealFrom, high, k)
      const target = this.cat.root.position.clone().setY(this.cat.root.position.y + 1.1)
      this.camera.lookAt(target.lerp(look, k))
    } else if (this.reveal.t < rise + hold) {
      const k = (this.reveal.t - rise) / hold
      this.camera.position.set(high.x, high.y, high.z - k * 8)
      this.camera.lookAt(look)
    } else if (this.reveal.t < rise + hold + rise) {
      const k = this.easeInOut((this.reveal.t - rise - hold) / rise)
      const back = this.desiredCameraPosition()
      this.camera.position.lerpVectors(high, back, k)
      const target = this.cat.root.position.clone().setY(this.cat.root.position.y + 1.1)
      this.camera.lookAt(look.clone().lerp(target, k))
    } else {
      this.reveal.active = false
      const fog = this.scene.fog as THREE.Fog
      fog.near = 70
      fog.far = 260
      this.callbacks.onReveal(false)
    }
    return false
  }

  private easeInOut(k: number) {
    const c = THREE.MathUtils.clamp(k, 0, 1)
    return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2
  }

  /* ---------- 釣り ---------- */

  private startFishing() {
    this.fishingPhase = 'cast'
    this.fishingT = 0
    this.cat.root.position.set(FISHING_SPOT.x, PIER.deckY, FISHING_SPOT.z)
    this.velY = 0
    this.grounded = true
    this.heading = FISHING_SPOT.heading
    this.cat.root.rotation.y = this.heading
    this.cat.rod.visible = true
    this.line.visible = true
    this.bobber.visible = true
    const spread = 1.6
    this.bobberTarget.set(
      POND.x + (Math.random() - 0.5) * spread,
      POND.surfaceY + 0.08,
      POND.z + (Math.random() - 0.5) * spread,
    )
    this.cat.rodTip.getWorldPosition(this.bobberFrom)
    this.bobber.position.copy(this.bobberFrom)
    this.callbacks.onFishing('cast')
  }

  private stopFishing() {
    this.fishingPhase = 'none'
    this.cat.rod.visible = false
    this.line.visible = false
    this.bobber.visible = false
    this.callbacks.onFishing('none')
  }

  private updateFishing(dt: number) {
    if (this.fishingPhase === 'none') return
    this.fishingT += dt

    if (this.fishingPhase === 'cast') {
      const k = Math.min(this.fishingT / 0.6, 1)
      this.bobber.position.lerpVectors(this.bobberFrom, this.bobberTarget, k)
      this.bobber.position.y += Math.sin(k * Math.PI) * 1.4
      if (k >= 1) {
        this.fishingPhase = 'wait'
        this.fishingT = 0
        this.waitDuration = 1.1 + Math.random() * 1.7
        this.spawnRipple(this.bobberTarget.x, this.bobberTarget.z, 1)
        this.callbacks.onFishing('wait')
      }
    } else if (this.fishingPhase === 'wait') {
      this.bobber.position.y = this.bobberTarget.y + Math.sin(this.fishingT * 3) * 0.03
      if (this.fishingT >= this.waitDuration) {
        this.fishingPhase = 'bite'
        this.fishingT = 0
        this.spawnRipple(this.bobberTarget.x, this.bobberTarget.z, 0.7)
        this.callbacks.onFishing('bite')
      }
    } else if (this.fishingPhase === 'bite') {
      // 失敗なし：引くまで待ってくれる
      this.bobber.position.y = this.bobberTarget.y - 0.15 + Math.sin(this.fishingT * 5) * 0.03
    } else if (this.fishingPhase === 'reel') {
      const k = Math.min(this.fishingT / 0.5, 1)
      const tip = new THREE.Vector3()
      this.cat.rodTip.getWorldPosition(tip)
      this.bobber.position.lerpVectors(this.bobberFrom, tip, k)
      this.bobber.position.y += Math.sin(k * Math.PI) * 1.1
      if (k >= 1) {
        this.fishingPhase = 'caught'
        this.fishingT = 0
        const slug = this.pullNextWork()
        this.callbacks.onFishing('caught')
        this.callbacks.onCatch(slug)
      }
    }

    if (this.line.visible) {
      const tip = new THREE.Vector3()
      this.cat.rodTip.getWorldPosition(tip)
      this.linePositions.set([tip.x, tip.y, tip.z, this.bobber.position.x, this.bobber.position.y, this.bobber.position.z])
      this.line.geometry.attributes.position.needsUpdate = true
    }
  }

  /** 未読キューから次の作品を引く。空になったら再シャッフル */
  private pullNextWork(): string {
    if (this.queue.length === 0) this.queue = shuffle(this.fishes.map((f) => f.slug))
    const slug = this.queue.shift()!
    if (!this.caughtSet.has(slug)) {
      this.caughtSet.add(slug)
      const fish = this.fishes.find((f) => f.slug === slug)
      if (fish) {
        for (const mat of fish.materials) {
          mat.transparent = true
          mat.opacity = 0.32
        }
      }
    }
    return slug
  }

  private spawnRipple(x: number, z: number, strength: number) {
    const slot = this.ripples.find((r) => r.life >= 1)
    if (!slot) return
    slot.life = 0
    slot.mesh.visible = true
    slot.mesh.position.x = x
    slot.mesh.position.z = z
    slot.mesh.userData.strength = strength
  }

  private updateRipples(dt: number) {
    for (const r of this.ripples) {
      if (r.life >= 1) continue
      r.life = Math.min(r.life + dt * 1.4, 1)
      const strength = (r.mesh.userData.strength as number) ?? 1
      r.mesh.scale.setScalar((0.3 + r.life * 2.2) * strength)
      const mat = r.mesh.material as THREE.MeshBasicMaterial
      mat.opacity = 0.42 * (1 - r.life)
      if (r.life >= 1) r.mesh.visible = false
    }
  }

  /* ---------- 移動 ---------- */

  private blocked(x: number, z: number, y: number) {
    if (islandField(x, z) < EDGE_MARGIN) return true
    for (const [cx, cz, cr] of this.colliders) {
      if (Math.hypot(x - cx, z - cz) < cr + 0.34) return true
    }
    // 池は桟橋の上以外は歩けない。見えている水際より少し外側で止める
    const onDeck = Math.abs(x - PIER.x) < PIER.hw + 0.1 && Math.abs(z - PIER.z) < PIER.hd + 0.1
    if (!onDeck) {
      const ex = (x - POND.x) / (POND.rx + 0.35)
      const ez = (z - POND.z) / (POND.rz + 0.35)
      if (ex * ex + ez * ez < 1) return true
    }
    // 高すぎる段差は跳ばないと登れない
    if (groundHeightAt(x, z) > y + STEP_UP) return true
    return false
  }

  private updateMovement(dt: number) {
    let ix = this.joystick.x
    let iz = this.joystick.z
    for (const code of this.keys) {
      const dir = MOVE_KEYS[code]
      if (dir) {
        ix += dir[0]
        iz += dir[1]
      }
    }
    const len = Math.hypot(ix, iz)
    this.moving = len > 0.15

    const pos = this.cat.root.position

    if (this.moving) {
      if (this.fishingPhase !== 'none' && this.fishingPhase !== 'caught') this.stopFishing()

      const nrm = Math.max(len, 1)
      ix /= nrm
      iz /= nrm
      // 入力はカメラの向きを基準に解釈する
      const fx = -Math.sin(this.yaw)
      const fz = -Math.cos(this.yaw)
      const rx = Math.cos(this.yaw)
      const rz = -Math.sin(this.yaw)
      let dx = fx * -iz + rx * ix
      let dz = fz * -iz + rz * ix
      const dl = Math.hypot(dx, dz) || 1
      dx /= dl
      dz /= dl

      const speed = (this.running ? RUN_SPEED : WALK_SPEED) * Math.min(len, 1)
      const nx = pos.x + dx * speed * dt
      const nz = pos.z + dz * speed * dt
      if (!this.blocked(nx, nz, pos.y)) {
        pos.x = nx
        pos.z = nz
      } else if (!this.blocked(nx, pos.z, pos.y)) {
        pos.x = nx
      } else if (!this.blocked(pos.x, nz, pos.y)) {
        pos.z = nz
      } else {
        this.moving = false
      }

      const targetHeading = Math.atan2(-dz, dx)
      let diff = targetHeading - this.heading
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      this.heading += diff * Math.min(dt * 12, 1)
      this.cat.root.rotation.y = this.heading
    }

    // 重力と着地
    this.velY -= GRAVITY * dt
    pos.y += this.velY * dt
    const ground = groundHeightAt(pos.x, pos.z)
    if (pos.y <= ground) {
      pos.y = ground
      this.velY = 0
      this.grounded = true
    } else {
      this.grounded = false
    }
  }

  /* ---------- 周辺 ---------- */

  private updateNap(dt: number) {
    if (this.uiOpen || this.fishingPhase !== 'none' || !this.grounded) {
      this.napTimer = 0
      this.napping = false
      return
    }
    const pos = this.cat.root.position
    const inSpot = Math.hypot(pos.x - NAP_SPOT.x, pos.z - NAP_SPOT.z) < NAP_SPOT.r
    if (this.moving || !inSpot) {
      this.napTimer = 0
      this.napping = false
      return
    }
    this.napTimer += dt
    if (this.napTimer > 2.6) this.napping = true
  }

  private updateAmbient(dt: number, t: number) {
    const catPos = this.cat.root.position

    const chimeDist = this.chimePos.distanceTo(catPos)
    const boost = chimeDist < 3.4 ? 1.9 : 1
    this.chimeSwing.rotation.z = Math.sin(t * 1.6) * 0.1 * boost
    this.chimeSwing.rotation.x = Math.cos(t * 1.3) * 0.055 * boost

    for (const b of this.butterflies) {
      const dist = b.group.position.distanceTo(catPos)
      if (dist < 1.9) b.fleeing = 1
      b.fleeing = Math.max(0, b.fleeing - dt * 0.4)
      if (b.fleeing > 0) {
        const away = new THREE.Vector3().subVectors(b.group.position, catPos).setY(0)
        if (away.lengthSq() > 0.0001) away.normalize()
        b.base.addScaledVector(away, dt * 3.4 * b.fleeing)
      }
      const wobble = b.fleeing > 0 ? 15 : 3
      b.group.position.set(
        b.base.x + Math.sin(t * 0.7 + b.phase) * 0.7,
        b.base.y + Math.sin(t * wobble + b.phase) * 0.14,
        b.base.z + Math.cos(t * 0.55 + b.phase) * 0.7,
      )
      const flap = Math.sin(t * (b.fleeing > 0 ? 26 : 10) + b.phase * 3)
      const wings = b.group.children
      wings[0].rotation.y = Math.PI / 2 + flap * 0.7
      wings[1].rotation.y = -Math.PI / 2 - flap * 0.7
    }

    for (const npc of this.npcs) animateNpc(npc, t, catPos)

    // 魚は楕円軌道を回遊し、進行方向を向く
    for (const fish of this.fishes) {
      fish.angle += dt * fish.speed
      fish.group.position.set(
        POND.x + Math.cos(fish.angle) * fish.radius,
        POND.surfaceY + 0.1 + Math.sin(t * 2 + fish.radius) * 0.02,
        POND.z + Math.sin(fish.angle) * fish.radius * (POND.rz / POND.rx),
      )
      fish.group.rotation.y = Math.atan2(
        -Math.cos(fish.angle) * (POND.rz / POND.rx),
        -Math.sin(fish.angle),
      )
    }

    // 陽の塵
    const attr = this.motes.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < this.motePhase.length; i += 1) {
      const base = 1 + ((i * 31) % 90) / 10
      attr.setY(i, base + Math.sin(t * 0.4 + this.motePhase[i]) * 1.6)
    }
    attr.needsUpdate = true
    this.motes.rotation.y = t * 0.008

    // 黄昏への遷移
    if (Math.abs(this.golden - this.goldenTarget) > 0.001) {
      this.golden += (this.goldenTarget - this.golden) * Math.min(dt * 0.6, 1)
      const g = this.golden
      this.sunlight.color.copy(DAY.sun).lerp(GOLDEN.sun, g)
      this.sunlight.intensity = DAY.sunI + (GOLDEN.sunI - DAY.sunI) * g
      this.ambient.color.copy(DAY.amb).lerp(GOLDEN.amb, g)
      this.ambient.intensity = DAY.ambI + (GOLDEN.ambI - DAY.ambI) * g
      this.hemisphere.color.copy(DAY.hemiSky).lerp(GOLDEN.hemiSky, g)
      this.hemisphere.groundColor.copy(DAY.hemiGround).lerp(GOLDEN.hemiGround, g)
      this.hemisphere.intensity = DAY.hemiI + (GOLDEN.hemiI - DAY.hemiI) * g
      ;(this.scene.fog as THREE.Fog).color.copy(DAY.fog).lerp(GOLDEN.fog, g)
      this.skyMat.uniforms.topColor.value.copy(DAY.skyTop).lerp(GOLDEN.skyTop, g)
      this.skyMat.uniforms.bottomColor.value.copy(DAY.skyBottom).lerp(GOLDEN.skyBottom, g)
    }

    // 阴影相机只跟随主角附近，不再把整座岛压进一张阴影贴图，猫的脚和尾巴会更清楚。
    const follow = 1 - Math.exp(-dt * 2.4)
    this.sunTarget.position.x += (catPos.x - this.sunTarget.position.x) * follow
    this.sunTarget.position.y += (catPos.y - this.sunTarget.position.y) * follow
    this.sunTarget.position.z += (catPos.z - this.sunTarget.position.z) * follow
    this.sunlight.position.set(
      this.sunTarget.position.x + 34 - this.golden * 22,
      this.sunTarget.position.y + 46 - this.golden * 26,
      this.sunTarget.position.z + 26 + this.golden * 14,
    )
    this.sunTarget.updateMatrixWorld()
  }

  private updatePrompt() {
    let next: Interactable | null = null
    if (!this.uiOpen && !this.reveal.active && this.fishingPhase === 'none') {
      const pos = this.cat.root.position
      let best = Number.POSITIVE_INFINITY
      for (const item of this.interactables) {
        if (item.taken) continue
        if (Math.abs(pos.y - item.y) > 2.6) continue
        const d = Math.hypot(pos.x - item.x, pos.z - item.z)
        if (d < item.r && d < best) {
          best = d
          next = item
        }
      }
    }
    if (next !== this.prompt) {
      this.prompt = next
      this.callbacks.onPrompt(next ? { kind: next.kind, id: next.id, index: next.index } : null)
    }
  }

  /* ---------- カメラ ---------- */

  private desiredCameraPosition() {
    const target = this.cat.root.position.clone()
    target.y += 1.05
    const cp = Math.cos(this.pitch)
    return new THREE.Vector3(
      target.x + Math.sin(this.yaw) * cp * this.dist,
      target.y + Math.sin(this.pitch) * this.dist,
      target.z + Math.cos(this.yaw) * cp * this.dist,
    )
  }

  private updateCamera(dt: number) {
    if (!this.started) {
      // 入場前：島をゆっくり見回す
      const a = this.clock.elapsedTime * 0.05
      this.camera.position.set(Math.sin(a) * 46 + 6, 26, Math.cos(a) * 46 - 6)
      this.camera.lookAt(4, 0, -4)
      return
    }
    const want = this.desiredCameraPosition()
    const floor = groundHeightAt(want.x, want.z) + 1
    if (want.y < floor) want.y = floor
    this.camera.position.lerp(want, 1 - Math.exp(-dt * 14))
    const look = this.cat.root.position.clone()
    look.y += 1.05
    this.camera.lookAt(look)
  }

  /* ---------- メインループ ---------- */

  private update(dt: number, t: number) {
    const cinematic = !this.updateReveal(dt)

    if (!this.uiOpen && !cinematic) this.updateMovement(dt)
    else this.moving = false
    this.updateNap(dt)

    const pose: CatPose = this.fishingPhase !== 'none'
      ? 'fishing'
      : !this.grounded
        ? 'jump'
        : this.moving && !this.uiOpen
          ? (this.running ? 'run' : 'walk')
          : this.napping
            ? 'nap'
            : 'idle'
    animateCat(this.cat, pose, t, 1)

    // 静止時は少しだけ肩越しにこちらを見る。三人称視点でも白目と表情が見え、
    // 2D 首页の「会看着你的猫」と同じ角色性がつながる。
    if (pose === 'idle' && this.started) {
      const cameraLocal = this.cat.root.worldToLocal(this.camera.position.clone())
      const lookAngle = Math.atan2(-cameraLocal.z, cameraLocal.x)
      this.cat.head.rotation.y = THREE.MathUtils.clamp(lookAngle, -0.48, 0.48)
    }

    // 瞳はカメラ（＝見ている人）を追う
    const base = this.cat.pupilBase
    const camLocal = this.cat.head.worldToLocal(this.camera.position.clone()).normalize()
    const pz = THREE.MathUtils.clamp(camLocal.z * 0.045, -0.028, 0.028)
    const py = THREE.MathUtils.clamp(camLocal.y * 0.035, -0.022, 0.022)
    this.cat.pupilL.position.set(base.x, base.y + py, -base.z + pz)
    this.cat.pupilR.position.set(base.x, base.y + py, base.z + pz)

    this.updateFishing(dt)
    this.updateRipples(dt)
    this.updateAmbient(dt, t)
    if (!cinematic) this.updateCamera(dt)
    this.updatePrompt()
  }
}
