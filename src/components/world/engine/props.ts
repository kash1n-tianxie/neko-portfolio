import * as THREE from 'three'
import { COLORS, addOutline, mulberry32, outlineDark, outlineInk, toonMat } from './materials'
import { islandField } from './island'
import { WORLD_DESTINATIONS } from '../destinations'

function mesh(
  geo: THREE.BufferGeometry,
  color: number,
  opts: { outline?: number; outlineMat?: THREE.Material; shadow?: boolean } = {},
) {
  const m = new THREE.Mesh(geo, toonMat(color))
  m.castShadow = opts.shadow !== false
  m.receiveShadow = true
  if (opts.outline) addOutline(m, opts.outline, opts.outlineMat ?? outlineDark)
  return m
}

const flat = (m: THREE.Mesh) => {
  m.castShadow = false
  return m
}

/* ---------- 記憶の池と桟橋 ---------- */

export const POND = { x: -12, z: 15, rx: 6.4, rz: 5, surfaceY: 0.06 }
export const PIER = { x: -12, z: 21, hw: 1.8, hd: 2.6, deckY: 0.35 }
/** 桟橋の先端で北（池の中心）を向いて構える */
export const FISHING_SPOT = { x: -12, z: 19.2, heading: Math.PI / 2 }

export function buildPond() {
  const group = new THREE.Group()
  const waves: THREE.Mesh[] = []
  const water = flat(
    new THREE.Mesh(new THREE.CircleGeometry(1, 44), toonMat(COLORS.water)),
  )
  water.rotation.x = -Math.PI / 2
  water.scale.set(POND.rx, POND.rz, 1)
  water.position.set(POND.x, POND.surfaceY, POND.z)
  water.receiveShadow = true
  group.add(water)

  const shore = flat(
    new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.08, 44),
      new THREE.MeshBasicMaterial({ color: COLORS.waterDeep }),
    ),
  )
  shore.rotation.x = -Math.PI / 2
  shore.scale.set(POND.rx, POND.rz, 1)
  shore.position.set(POND.x, POND.surfaceY + 0.01, POND.z)
  group.add(shore)

  // Sparse, fine contour lines keep the water illustrated rather than mirror-like.
  const waveGeometry = new THREE.RingGeometry(0.99, 1, 64)
  for (let i = 0; i < 4; i += 1) {
    const wave = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({
      color: COLORS.pale, transparent: true, opacity: 0.12, depthWrite: false,
    }))
    wave.rotation.x = -Math.PI / 2
    wave.position.set(POND.x, POND.surfaceY + 0.025, POND.z)
    const size = 0.3 + i * 0.18
    wave.scale.set(POND.rx * size, POND.rz * size, 1)
    wave.userData.baseScale = size
    waves.push(wave)
    group.add(wave)
  }
  return { group, waves }
}

/* ---------- Featured projects: small exhibits with their current release status ---------- */

function labelTexture(title: string, subtitle?: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = subtitle ? 384 : 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#272b23'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#faf7ef'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${subtitle ? 130 : 156}px monospace`
  ctx.fillText(title, 512, subtitle ? 151 : 136, 960)
  if (subtitle) {
    ctx.fillStyle = '#d6c9aa'
    ctx.font = '48px sans-serif'
    ctx.fillText(subtitle, 512, 285, 940)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function buildFeaturedStand(id: '2048' | 'tamago-exe', title: string, locale: 'ja' | 'en', status: 'IN_PROGRESS' | 'LIVE' = 'IN_PROGRESS') {
  const group = new THREE.Group()
  const base = mesh(new THREE.CylinderGeometry(1.85, 2.02, 0.28, 8), COLORS.wood, { outline: 1.025 })
  base.position.y = 0.15
  group.add(base)
  const pedestal = mesh(new THREE.CylinderGeometry(1.13, 1.35, 0.75, 8), COLORS.pale, { outline: 1.025 })
  pedestal.position.y = 0.67
  group.add(pedestal)
  if (id === '2048') {
    const geometry = new THREE.BoxGeometry(0.68, 0.68, 0.4)
    for (let i = 0; i < 4; i += 1) {
      const tile = mesh(geometry, i === 3 ? COLORS.accent : COLORS.path, { outline: 1.025 })
      tile.position.set((i % 2 - 0.5) * 0.78, 1.42 + Math.floor(i / 2) * 0.77, 0)
      const number = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.35), new THREE.MeshBasicMaterial({
        map: labelTexture(String(2 ** (i + 1))), toneMapped: false,
      }))
      number.position.z = 0.211
      tile.add(number)
      group.add(tile)
    }
  } else {
    const egg = mesh(new THREE.SphereGeometry(0.69, 16, 12), COLORS.pale, { outline: 1.035 })
    egg.scale.set(0.92, 1.2, 0.86)
    egg.position.y = 1.87
    group.add(egg)
    const dotGeo = new THREE.SphereGeometry(0.05, 8, 6)
    for (const x of [-0.19, 0.19]) {
      const eye = mesh(dotGeo, COLORS.ink, { shadow: false })
      eye.position.set(x, 1.92, 0.57)
      group.add(eye)
    }
  }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.55, 1.33), new THREE.MeshBasicMaterial({
    map: labelTexture(title, status === 'LIVE'
      ? (locale === 'ja' ? '無料体験版 公開中' : 'FREE DEMO AVAILABLE')
      : (locale === 'ja' ? '制作中 · FEATURED PROJECT' : 'IN PROGRESS · FEATURED PROJECT')),
    toneMapped: false,
  }))
  sign.position.set(0, 3.75, -0.25)
  group.add(sign)
  const pole = mesh(new THREE.CylinderGeometry(0.055, 0.055, 3.75, 6), COLORS.woodDark, { shadow: false })
  pole.position.set(0, 1.88, -0.35)
  group.add(pole)
  return group
}

export function buildPier() {
  const group = new THREE.Group()
  const plank = new THREE.BoxGeometry(PIER.hw * 2, 0.1, 0.66)
  for (let i = 0; i < 7; i += 1) {
    const p = mesh(plank, COLORS.wood, { outline: 1.04 })
    p.position.set(PIER.x, PIER.deckY, PIER.z - PIER.hd + 0.42 + i * 0.72)
    group.add(p)
  }
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 6)
  for (const dx of [-PIER.hw + 0.3, PIER.hw - 0.3]) {
    for (const dz of [-PIER.hd + 0.4, 0, PIER.hd - 0.4]) {
      const leg = mesh(legGeo, COLORS.woodDark, { shadow: false })
      leg.position.set(PIER.x + dx, -0.15, PIER.z + dz)
      group.add(leg)
    }
  }
  return group
}

/* ---------- 鳥居（2Dへ戻る門） ---------- */

export function buildTorii() {
  const group = new THREE.Group()
  const red = COLORS.accent
  const pillar = new THREE.CylinderGeometry(0.3, 0.36, 4.6, 10)
  for (const x of [-2.1, 2.1]) {
    const p = mesh(pillar, red, { outline: 1.06 })
    p.position.set(x, 2.3, 0)
    group.add(p)
  }
  const kasagi = mesh(new THREE.BoxGeometry(6.2, 0.42, 0.5), red, { outline: 1.04 })
  kasagi.position.y = 4.75
  group.add(kasagi)
  const cap = mesh(new THREE.BoxGeometry(6.6, 0.2, 0.6), COLORS.ink, { outline: 1.04 })
  cap.position.y = 5.05
  group.add(cap)
  const nuki = mesh(new THREE.BoxGeometry(5.3, 0.3, 0.34), red, { outline: 1.05 })
  nuki.position.y = 3.7
  group.add(nuki)
  const gakuzuka = mesh(new THREE.BoxGeometry(0.3, 0.65, 0.3), red)
  gakuzuka.position.y = 4.2
  group.add(gakuzuka)
  return group
}

/* ---------- 工房（技術） ---------- */

export function buildHut() {
  const group = new THREE.Group()
  const base = mesh(new THREE.BoxGeometry(4.4, 2.7, 3.6), COLORS.pale, { outline: 1.03 })
  base.position.y = 1.35
  group.add(base)
  const beamGeo = new THREE.BoxGeometry(0.22, 2.7, 0.22)
  for (const [x, z] of [[-2.1, 1.7], [2.1, 1.7], [-2.1, -1.7], [2.1, -1.7]]) {
    const beam = mesh(beamGeo, COLORS.woodDark, { shadow: false })
    beam.position.set(x, 1.35, z)
    group.add(beam)
  }
  const roof = mesh(new THREE.ConeGeometry(3.7, 1.8, 4), COLORS.roof, {
    outline: 1.04,
    outlineMat: outlineInk,
  })
  roof.position.y = 3.6
  roof.rotation.y = Math.PI / 4
  group.add(roof)

  const door = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.9), new THREE.MeshBasicMaterial({ color: COLORS.woodDark })),
  )
  door.position.set(0, 0.95, 1.81)
  group.add(door)

  // 壁に掛かった道具＝使い込まれた技術
  const toolMat = new THREE.MeshBasicMaterial({ color: COLORS.ink })
  const wrench = flat(new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.8, 4, 6), toolMat))
  wrench.position.set(-1.5, 1.7, 1.81)
  wrench.rotation.z = 0.5
  group.add(wrench)
  const gear = flat(new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 6, 9), toolMat))
  gear.position.set(1.5, 1.8, 1.81)
  group.add(gear)
  const brush = flat(new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.6, 4, 6), toolMat))
  brush.position.set(-1.5, 0.7, 1.81)
  brush.rotation.z = -0.35
  group.add(brush)
  const seal = flat(
    new THREE.Mesh(new THREE.CircleGeometry(0.19, 14), new THREE.MeshBasicMaterial({ color: COLORS.accent })),
  )
  seal.position.set(1.55, 0.75, 1.82)
  group.add(seal)
  return group
}

/* ---------- 縁側と掛け軸（経歴） ---------- */

export function buildEngawa() {
  const group = new THREE.Group()
  const deck = mesh(new THREE.BoxGeometry(4.2, 0.32, 2.2), COLORS.wood, { outline: 1.03 })
  deck.position.y = 0.28
  group.add(deck)
  const legGeo = new THREE.BoxGeometry(0.24, 0.28, 0.24)
  for (const [x, z] of [[-1.85, -0.85], [1.85, -0.85], [-1.85, 0.85], [1.85, 0.85]]) {
    const leg = mesh(legGeo, COLORS.woodDark, { shadow: false })
    leg.position.set(x, 0.14, z)
    group.add(leg)
  }
  const back = mesh(new THREE.BoxGeometry(4.2, 3.1, 0.2), COLORS.pale, { outline: 1.02 })
  back.position.set(0, 1.85, -1.1)
  group.add(back)
  const roof = mesh(new THREE.BoxGeometry(4.8, 0.22, 2.8), COLORS.roof, { outline: 1.03 })
  roof.position.set(0, 3.45, -0.4)
  roof.rotation.x = -0.12
  group.add(roof)

  const scroll = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.15), new THREE.MeshBasicMaterial({ color: COLORS.pale })),
  )
  scroll.position.set(0, 1.9, -0.98)
  group.add(scroll)
  const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.35, 6)
  for (const y of [2.98, 0.82]) {
    const rod = mesh(rodGeo, COLORS.woodDark, { shadow: false })
    rod.rotation.z = Math.PI / 2
    rod.position.set(0, y, -0.98)
    group.add(rod)
  }
  const strokeMat = new THREE.MeshBasicMaterial({ color: COLORS.ink })
  for (const [y, w, r] of [[2.5, 0.62, 0.28], [2.02, 0.78, -0.18], [1.5, 0.5, 0.46]] as const) {
    const stroke = flat(new THREE.Mesh(new THREE.PlaneGeometry(w, 0.1), strokeMat))
    stroke.position.set(0, y, -0.97)
    stroke.rotation.z = r
    group.add(stroke)
  }
  const seal = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), new THREE.MeshBasicMaterial({ color: COLORS.accent })),
  )
  seal.position.set(0.36, 1.06, -0.97)
  group.add(seal)

  const cushion = mesh(new THREE.CylinderGeometry(0.44, 0.48, 0.16, 12), COLORS.accent)
  cushion.position.set(1.05, 0.52, 0.35)
  group.add(cushion)
  return group
}

/* ---------- 石灯籠と郵便受け（連絡） ---------- */

export function buildLantern() {
  const group = new THREE.Group()
  const base = mesh(new THREE.BoxGeometry(1.2, 0.42, 1.2), COLORS.stone, { outline: 1.05 })
  base.position.y = 0.21
  group.add(base)
  const shaft = mesh(new THREE.CylinderGeometry(0.19, 0.23, 1.2, 8), COLORS.stone)
  shaft.position.y = 1.02
  group.add(shaft)
  const firebox = mesh(new THREE.BoxGeometry(0.78, 0.64, 0.78), COLORS.stone, { outline: 1.05 })
  firebox.position.y = 1.95
  group.add(firebox)
  const winMat = new THREE.MeshBasicMaterial({ color: 0xf7e3bb })
  for (const ry of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const win = flat(new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.36), winMat))
    win.position.set(Math.sin(ry) * 0.4, 1.95, Math.cos(ry) * 0.4)
    win.rotation.y = ry
    group.add(win)
  }
  const roof = mesh(new THREE.ConeGeometry(0.8, 0.54, 4), COLORS.roof, {
    outline: 1.06,
    outlineMat: outlineInk,
  })
  roof.position.y = 2.54
  roof.rotation.y = Math.PI / 4
  group.add(roof)
  const orb = mesh(new THREE.SphereGeometry(0.13, 10, 8), COLORS.stone)
  orb.position.y = 2.93
  group.add(orb)

  // 朱い郵便受け
  const pole = mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 6), COLORS.woodDark)
  pole.position.set(1.7, 0.55, 0.5)
  group.add(pole)
  const box = mesh(new THREE.BoxGeometry(0.66, 0.54, 0.46), COLORS.accent, { outline: 1.06 })
  box.position.set(1.7, 1.32, 0.5)
  group.add(box)
  const slot = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.06), new THREE.MeshBasicMaterial({ color: COLORS.ink })),
  )
  slot.position.set(1.7, 1.4, 0.735)
  group.add(slot)
  return group
}

/* ---------- 研究塔（卒業研究） ---------- */

export function buildTower() {
  const group = new THREE.Group()
  const tiers: [number, number, number][] = [
    [2.3, 2.6, 0],
    [1.95, 2.3, 2.75],
    [1.6, 2.0, 5.2],
  ]
  for (const [r, h, y] of tiers) {
    const body = mesh(new THREE.CylinderGeometry(r * 0.92, r, h, 8), COLORS.pale, { outline: 1.03 })
    body.position.y = y + h / 2
    group.add(body)
    const eave = mesh(new THREE.ConeGeometry(r + 0.85, 0.7, 8), COLORS.roof, {
      outline: 1.04,
      outlineMat: outlineInk,
    })
    eave.position.y = y + h + 0.2
    group.add(eave)
  }
  // 最上部：観測の眼
  const cap = mesh(new THREE.ConeGeometry(1.5, 1.4, 8), COLORS.roof, { outline: 1.04, outlineMat: outlineInk })
  cap.position.y = 7.9
  group.add(cap)
  const orb = mesh(new THREE.IcosahedronGeometry(0.42, 0), COLORS.accent, { outline: 1.12 })
  orb.position.y = 9
  group.add(orb)

  const winMat = new THREE.MeshBasicMaterial({ color: COLORS.ink })
  for (const [y, ry] of [[1.4, 0], [1.4, Math.PI], [4, Math.PI / 2], [6.3, -Math.PI / 2]] as const) {
    const win = flat(new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.8), winMat))
    const r = y < 2.6 ? 2.35 : y < 5.2 ? 2.0 : 1.65
    win.position.set(Math.sin(ry) * r, y, Math.cos(ry) * r)
    win.rotation.y = ry
    group.add(win)
  }
  return group
}

/* ---------- 展望台（島の正体が分かる場所） ---------- */

export function buildViewpoint() {
  const group = new THREE.Group()
  const deck = mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.24, 12), COLORS.wood, { outline: 1.03 })
  deck.position.y = 0.12
  group.add(deck)
  const postGeo = new THREE.CylinderGeometry(0.11, 0.11, 1.05, 6)
  const railGeo = new THREE.TorusGeometry(2.85, 0.07, 6, 20)
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2
    const post = mesh(postGeo, COLORS.woodDark, { shadow: false })
    post.position.set(Math.cos(a) * 2.85, 0.75, Math.sin(a) * 2.85)
    group.add(post)
  }
  const rail = mesh(railGeo, COLORS.woodDark, { shadow: false })
  rail.rotation.x = Math.PI / 2
  rail.position.y = 1.2
  group.add(rail)

  // 中央の標石：ここで顔を上げると島の形が分かる
  const stone = mesh(new THREE.BoxGeometry(0.6, 1.3, 0.42), COLORS.stone, { outline: 1.06 })
  stone.position.y = 0.9
  group.add(stone)
  const seal = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ color: COLORS.accent })),
  )
  seal.position.set(0, 1.15, 0.22)
  group.add(seal)
  return group
}

/* ---------- 招き猫の石像（中央広場） ---------- */

export function buildStatue() {
  const group = new THREE.Group()
  const pedestal = mesh(new THREE.CylinderGeometry(0.8, 0.95, 0.55, 8), COLORS.rock, { outline: 1.04 })
  pedestal.position.y = 0.27
  group.add(pedestal)
  const body = mesh(new THREE.CapsuleGeometry(0.44, 0.42, 6, 12), COLORS.stone, { outline: 1.05 })
  body.position.y = 1.18
  group.add(body)
  const head = mesh(new THREE.SphereGeometry(0.36, 14, 12), COLORS.stone, { outline: 1.06 })
  head.position.y = 1.9
  group.add(head)
  const earGeo = new THREE.ConeGeometry(0.13, 0.22, 4)
  for (const z of [-0.21, 0.21]) {
    const ear = mesh(earGeo, COLORS.stone)
    ear.position.set(0, 2.18, z)
    group.add(ear)
  }
  const paw = mesh(new THREE.CapsuleGeometry(0.12, 0.32, 4, 8), COLORS.stone)
  paw.position.set(0.3, 1.66, -0.3)
  paw.rotation.z = -0.5
  group.add(paw)
  const bib = mesh(new THREE.TorusGeometry(0.25, 0.06, 6, 16), COLORS.accent)
  bib.position.y = 1.6
  bib.rotation.x = Math.PI / 2
  group.add(bib)
  return group
}

/* ---------- 道しるべ ---------- */

export function buildSignpost() {
  const group = new THREE.Group()
  const post = mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4, 6), COLORS.woodDark, { outline: 1.06 })
  post.position.y = 1.2
  group.add(post)
  const boardGeo = new THREE.BoxGeometry(1.35, 0.3, 0.09)
  const dirs: [number, number][] = [[1.95, 0.5], [1.6, 2.2], [1.25, 3.9], [0.9, 5.1]]
  for (const [y, ry] of dirs) {
    const board = mesh(boardGeo, COLORS.pale, { outline: 1.05 })
    board.position.set(Math.cos(ry) * 0.5, y, Math.sin(ry) * 0.5)
    board.rotation.y = -ry
    group.add(board)
  }
  return group
}

/* ---------- 年輪の道の石碑（成長の時系列） ---------- */

export function buildMilestone() {
  const group = new THREE.Group()
  const base = mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.28, 8), COLORS.rock, { outline: 1.05 })
  base.position.y = 0.14
  group.add(base)
  const slab = mesh(new THREE.BoxGeometry(0.72, 1.6, 0.26), COLORS.stone, { outline: 1.05 })
  slab.position.y = 1.05
  group.add(slab)
  const band = flat(
    new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.14), new THREE.MeshBasicMaterial({ color: COLORS.accent })),
  )
  band.position.set(0, 1.45, 0.14)
  group.add(band)
  return group
}

/* ---------- 迷子の子猫 ---------- */

export function buildKitten(color = 0x35322e) {
  const group = new THREE.Group()
  const body = mesh(new THREE.CapsuleGeometry(0.17, 0.24, 5, 10), color, { outline: 1.1, outlineMat: outlineInk })
  body.rotation.z = Math.PI / 2
  body.position.y = 0.2
  group.add(body)
  const head = mesh(new THREE.SphereGeometry(0.17, 12, 10), color, { outline: 1.1, outlineMat: outlineInk })
  head.position.set(0.22, 0.36, 0)
  group.add(head)
  const earGeo = new THREE.ConeGeometry(0.07, 0.13, 4)
  for (const z of [-0.09, 0.09]) {
    const ear = mesh(earGeo, color, { shadow: false })
    ear.position.set(0.2, 0.5, z)
    group.add(ear)
  }
  const eyeMat = new THREE.MeshBasicMaterial({ color: COLORS.pale })
  for (const z of [-0.07, 0.07]) {
    const eye = flat(new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 6), eyeMat))
    eye.position.set(0.35, 0.38, z)
    group.add(eye)
  }
  const collar = mesh(new THREE.TorusGeometry(0.13, 0.028, 6, 14), COLORS.accent, { shadow: false })
  collar.position.set(0.14, 0.31, 0)
  collar.rotation.y = Math.PI / 2
  group.add(collar)
  const tail = mesh(new THREE.CapsuleGeometry(0.035, 0.28, 4, 6), color, { shadow: false })
  tail.position.set(-0.26, 0.35, 0)
  tail.rotation.z = -0.5
  group.add(tail)
  return group
}

/* ---------- 風鈴 ---------- */

export function buildWindChime() {
  const group = new THREE.Group()
  const post = mesh(new THREE.CylinderGeometry(0.09, 0.11, 2.4, 6), COLORS.woodDark, { outline: 1.06 })
  post.position.y = 1.2
  group.add(post)
  const bar = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 6), COLORS.woodDark, { shadow: false })
  bar.rotation.z = Math.PI / 2
  bar.position.set(0.45, 2.35, 0)
  group.add(bar)

  const swing = new THREE.Group()
  swing.position.set(0.88, 2.32, 0)
  group.add(swing)
  const bell = mesh(new THREE.ConeGeometry(0.14, 0.2, 10, 1, true), COLORS.accent, {
    outline: 1.08,
    outlineMat: outlineInk,
    shadow: false,
  })
  bell.position.y = -0.24
  swing.add(bell)
  const clapper = mesh(new THREE.SphereGeometry(0.03, 6, 6), COLORS.ink, { shadow: false })
  clapper.position.y = -0.42
  swing.add(clapper)
  const strip = flat(
    new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.28),
      new THREE.MeshBasicMaterial({ color: COLORS.pale, side: THREE.DoubleSide }),
    ),
  )
  strip.position.y = -0.6
  swing.add(strip)
  return { group, swing }
}

/* ---------- 蝶 ---------- */

export type Butterfly = { group: THREE.Group; base: THREE.Vector3; phase: number; fleeing: number }

export function buildButterfly(x: number, z: number, phase: number): Butterfly {
  const group = new THREE.Group()
  const wingMat = toonMat(COLORS.accent).clone()
  wingMat.side = THREE.DoubleSide
  const wingGeo = new THREE.CircleGeometry(0.1, 8, 0, Math.PI)
  const left = flat(new THREE.Mesh(wingGeo, wingMat))
  left.rotation.y = Math.PI / 2
  group.add(left)
  const right = flat(new THREE.Mesh(wingGeo, wingMat))
  right.rotation.y = -Math.PI / 2
  group.add(right)
  const body = mesh(new THREE.CapsuleGeometry(0.013, 0.09, 3, 4), COLORS.ink, { shadow: false })
  body.rotation.z = Math.PI / 2
  group.add(body)

  const base = new THREE.Vector3(x, 1, z)
  group.position.copy(base)
  return { group, base, phase, fleeing: 0 }
}

/* ---------- 陽だまり（長く留まると猫が丸くなる） ---------- */

export const NAP_SPOT = { x: 7.5, z: 6.5, r: 1.6 }

export function buildNapSpot() {
  const ring = flat(
    new THREE.Mesh(
      new THREE.RingGeometry(1.05, 1.35, 22),
      new THREE.MeshBasicMaterial({ color: COLORS.pale, transparent: true, opacity: 0.38 }),
    ),
  )
  ring.rotation.x = -Math.PI / 2
  ring.position.set(NAP_SPOT.x, 0.03, NAP_SPOT.z)
  return ring
}

/* ---------- 木と岩を島じゅうに散らす ---------- */

/** ここには木を生やさない（建物・道・イベント地点） */
const CLEARINGS: [number, number, number][] = [
  ...WORLD_DESTINATIONS.filter((item) => item.landmark).map((item): [number, number, number] => [item.landmark!.x, item.landmark!.z, 4.8]),
  // 出生地（島の南端）と鳥居
  [0, 27, 8], [0, 37, 5], [0, 32, 4.5],
  // 各区画
  [-12, 15, 10], [13, 15, 5.5], [-15, -2, 5], [15, -9, 5.5],
  [-5.4, -21, 5], [0, -38, 11], [-9.5, -47, 6], [9.5, -47, 6],
  [-7.5, -43.5, 4], [7.5, -43.5, 4],
  // 尻尾の道は最後まで歩けるように空けておく
  [22, 29, 5], [28, 28.5, 5], [32.5, 26.5, 5], [36, 23, 5],
  [38.5, 18.5, 5], [40, 13.5, 5], [40.5, 8.5, 5], [40, 3.5, 5], [38.5, -1, 5],
  [7.5, 6.5, 3], [11, -3, 3], [17.6, -12.6, 3], [-12.6, -9.4, 2.5], [-17, 10, 3],
  // 出生地から北へ伸びる導線は歩きやすく空けておく
  [0, 21, 4.5], [0, 14, 4.5], [0, 7, 4.5], [0, 0, 4.5], [0, -7, 4.5],
  [0, -14, 4.5], [0, -20, 4.5], [0, -26, 4.5], [0, -31, 4.5],
  [-5, 22, 4], [-9, 20, 4], [5, 22, 4], [9, 18, 4],
  [-8, 10, 4], [-12, 3, 4], [7, 10, 4], [11, 2, 4],
]

export function buildScatter() {
  const group = new THREE.Group()
  const colliders: [number, number, number][] = []
  const rand = mulberry32(915237)
  const trunkGeo = new THREE.CylinderGeometry(0.16, 0.24, 1.5, 7)
  const rockGeo = new THREE.IcosahedronGeometry(0.55, 0)
  const tierSpecs: [number, number][] = [[1.15, 1.4], [0.88, 1.15], [0.55, 0.92]]

  const free = (x: number, z: number, pad: number) => {
    if (islandField(x, z) < pad) return false
    for (const [cx, cz, cr] of CLEARINGS) {
      if (Math.hypot(x - cx, z - cz) < cr) return false
    }
    return true
  }

  const taken: [number, number][] = []
  const spaced = (x: number, z: number, gap: number) =>
    taken.every(([tx, tz]) => Math.hypot(x - tx, z - tz) > gap)

  let placed = 0
  for (let i = 0; i < 1400 && placed < 26; i += 1) {
    const x = -30 + rand() * 78
    const z = -56 + rand() * 96
    if (!free(x, z, 4.5) || !spaced(x, z, 5.5)) continue
    placed += 1
    taken.push([x, z])
    const tree = new THREE.Group()
    const trunk = mesh(trunkGeo, COLORS.woodDark, { shadow: false })
    trunk.position.y = 0.75
    tree.add(trunk)
    let y = 1.55
    for (const [r, h] of tierSpecs) {
      const tier = mesh(new THREE.ConeGeometry(r, h, 7), rand() > 0.5 ? COLORS.grassDark : COLORS.grass, {
        outline: 1.05,
        outlineMat: outlineInk,
      })
      tier.position.y = y + h / 2
      tree.add(tier)
      y += h * 0.6
    }
    tree.position.set(x, 0, z)
    tree.scale.setScalar(0.75 + rand() * 0.6)
    tree.rotation.y = rand() * Math.PI
    group.add(tree)
    colliders.push([x, z, 0.5])
  }

  let rocks = 0
  for (let i = 0; i < 900 && rocks < 20; i += 1) {
    const x = -30 + rand() * 78
    const z = -56 + rand() * 96
    if (!free(x, z, 2.6) || !spaced(x, z, 3.4)) continue
    rocks += 1
    taken.push([x, z])
    const s = 0.6 + rand() * 1.1
    const rock = mesh(rockGeo, COLORS.rock, { outline: 1.07 })
    rock.position.set(x, 0.24 * s, z)
    rock.scale.set(s, s * 0.62, s)
    rock.rotation.set(rand(), rand() * Math.PI, rand() * 0.3)
    group.add(rock)
    colliders.push([x, z, s * 0.7])
  }
  return { group, colliders }
}

/* ---------- 魚（作品ごとに 1 匹） ---------- */

export type FishTag = 'GAME' | 'WEB' | 'TOOL'

export type Fish = {
  group: THREE.Group
  slug: string
  angle: number
  radius: number
  speed: number
  materials: THREE.MeshToonMaterial[]
}

export function buildFish(slug: string, tag: FishTag, index: number, total: number): Fish {
  const group = new THREE.Group()
  const bodyMat = toonMat(COLORS.fish).clone()
  const finMat = toonMat(COLORS.accent).clone()

  let bodyGeo: THREE.BufferGeometry
  if (tag === 'WEB') {
    bodyGeo = new THREE.CapsuleGeometry(0.13, 0.6, 4, 8)
  } else if (tag === 'TOOL') {
    bodyGeo = new THREE.BoxGeometry(0.62, 0.22, 0.26)
  } else {
    bodyGeo = new THREE.SphereGeometry(0.26, 10, 8)
  }
  const body = flat(new THREE.Mesh(bodyGeo, bodyMat))
  if (tag === 'WEB') body.rotation.z = Math.PI / 2
  if (tag === 'GAME') body.scale.set(1.35, 0.75, 0.8)
  addOutline(body, 1.09, outlineInk)
  group.add(body)

  const tailFin = flat(new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 4), finMat))
  tailFin.position.x = tag === 'WEB' ? -0.55 : -0.42
  tailFin.rotation.z = Math.PI / 2
  tailFin.scale.set(1, 1, 0.4)
  group.add(tailFin)

  const angle = (index / total) * Math.PI * 2
  const radius = 1.8 + (index % 3) * 1.1
  return {
    group,
    slug,
    angle,
    radius,
    speed: 0.3 + (index % 4) * 0.1,
    materials: [bodyMat, finMat],
  }
}
