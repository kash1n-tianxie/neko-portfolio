import * as THREE from 'three'

/**
 * 昼の浮島パレット。サイトの「昼」テーマ（紙の白・墨・朱）を基調に、
 * 広い島でも単調にならない程度の彩度だけを足している。
 * `ink` は「濃い墨線」の役。白く抜きたい要素（瞳・紙・波紋）は `pale`。
 */
export const COLORS = {
  skyTop: 0x7599bc,
  skyBottom: 0xf1e4cd,
  fog: 0xd8dbd2,
  cloud: 0xfffbf2,
  cloudShade: 0xd9ddd9,

  grass: 0xaab58c,
  grassDark: 0x7f906f,
  path: 0xe0d1aa,
  soil: 0x6f6252,
  soilDeep: 0x433c34,
  rock: 0x87857d,

  pale: 0xfaf7ef,
  ink: 0x1c1a17,
  muted: 0x8d877a,
  accent: 0xc93a2b,

  wood: 0x6d5c46,
  woodDark: 0x4e412f,
  roof: 0x3c3a3c,
  stone: 0x8d8574,
  charcoal: 0x232323,
  water: 0x73a0aa,
  waterDeep: 0x496f7c,
  fish: 0x4f4a41,
} as const

let gradientMap: THREE.DataTexture | null = null

/** 4段トゥーン用グラデーション（全マテリアルで共有） */
function getGradientMap() {
  if (!gradientMap) {
    const data = new Uint8Array([90, 90, 90, 255, 150, 150, 150, 255, 214, 214, 214, 255, 255, 255, 255, 255])
    gradientMap = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat)
    gradientMap.minFilter = THREE.NearestFilter
    gradientMap.magFilter = THREE.NearestFilter
    gradientMap.needsUpdate = true
  }
  return gradientMap
}

const toonCache = new Map<number, THREE.MeshToonMaterial>()

export function toonMat(color: number) {
  let mat = toonCache.get(color)
  if (!mat) {
    mat = new THREE.MeshToonMaterial({ color, gradientMap: getGradientMap() })
    toonCache.set(color, mat)
  }
  return mat
}

/** 墨線アウトライン（背面法）。白い紙に黒い線、という漫画の描き方を 3D に持ち込む */
export const outlineInk = new THREE.MeshBasicMaterial({
  color: 0x2b2318,
  side: THREE.BackSide,
  toneMapped: false,
})
export const outlineDark = new THREE.MeshBasicMaterial({
  color: 0x141210,
  side: THREE.BackSide,
  toneMapped: false,
})

/** メッシュの子として反転シェルを足す（親の変形・アニメに自動追従） */
export function addOutline(mesh: THREE.Mesh, scale = 1.05, material: THREE.Material = outlineDark) {
  const shell = new THREE.Mesh(mesh.geometry, material)
  shell.scale.setScalar(scale)
  shell.castShadow = false
  shell.receiveShadow = false
  mesh.add(shell)
  return shell
}

/** 柔らかい丸のスプライト用テクスチャ（光の粒・花びら共用） */
export function makeDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,0.95)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.4)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** 決定論的な乱数（島の草木を毎回同じ配置にするため） */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
