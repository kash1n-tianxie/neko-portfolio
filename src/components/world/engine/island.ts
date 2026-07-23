import * as THREE from 'three'
import { COLORS, makeDotTexture, mulberry32, toonMat } from './materials'

/**
 * 島の形。上空から見ると伏せた猫だが、地上を歩いている間は気づかない。
 * 円の集合（メタボール）として定義し、同じ場の関数を「見た目の輪郭」と
 * 「歩ける範囲」の両方に使うので、崖の見た目と当たりが必ず一致する。
 */
export type Blob = { x: number; z: number; r: number }

export const ISLAND_BLOBS: Blob[] = [
  // 頭と耳
  { x: 0, z: -36, r: 14 },
  { x: -9, z: -46.5, r: 5.6 },
  { x: -11.5, z: -51, r: 3.2 },
  { x: 9, z: -46.5, r: 5.6 },
  { x: 11.5, z: -51, r: 3.2 },
  // 首と胴
  { x: 0, z: -23, r: 11.5 },
  { x: 0, z: -10, r: 17 },
  { x: 0, z: 6, r: 20 },
  { x: 0, z: 22, r: 18 },
  // 前脚
  { x: -11, z: -27, r: 5.5 },
  { x: 11, z: -27, r: 5.5 },
  // 後脚
  { x: -17, z: 18, r: 8 },
  { x: 17, z: 18, r: 8 },
  // 尻尾：隣どうしが必ず重なるよう間隔 5 前後で並べる（歩ける幅を保つため）
  { x: 18, z: 27, r: 6 },
  { x: 23, z: 28.5, r: 5.8 },
  { x: 28, z: 28.5, r: 5.6 },
  { x: 32.5, z: 26.5, r: 5.4 },
  { x: 36, z: 23, r: 5.2 },
  { x: 38.5, z: 18.5, r: 5 },
  { x: 40, z: 13.5, r: 4.9 },
  { x: 40.5, z: 8.5, r: 4.8 },
  { x: 40, z: 3.5, r: 4.7 },
  { x: 38.5, z: -1, r: 4.6 },
]

/** > 0 なら島の内側。値はおおよそ「岸までの距離」 */
export function islandField(x: number, z: number) {
  let best = -Infinity
  for (const b of ISLAND_BLOBS) {
    const v = b.r - Math.hypot(x - b.x, z - b.z)
    if (v > best) best = v
  }
  return best
}

/* ---------- 輪郭抽出（マーチングスクエア） ---------- */

// セルの4隅 c0=左下 c1=右下 c2=右上 c3=左上、辺 0=下 1=右 2=上 3=左
const MS_EDGES: number[][] = [
  [], [3, 0], [0, 1], [3, 1],
  [1, 2], [3, 0, 1, 2], [0, 2], [3, 2],
  [2, 3], [2, 0], [0, 1, 2, 3], [2, 1],
  [1, 3], [1, 0], [0, 3], [],
]

type Seg = [THREE.Vector2, THREE.Vector2]

function extractOutline(cell = 1.8): THREE.Vector2[] {
  let minX = Infinity
  let maxX = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity
  for (const b of ISLAND_BLOBS) {
    minX = Math.min(minX, b.x - b.r)
    maxX = Math.max(maxX, b.x + b.r)
    minZ = Math.min(minZ, b.z - b.r)
    maxZ = Math.max(maxZ, b.z + b.r)
  }
  minX -= cell * 2
  minZ -= cell * 2
  maxX += cell * 2
  maxZ += cell * 2

  const nx = Math.ceil((maxX - minX) / cell)
  const nz = Math.ceil((maxZ - minZ) / cell)
  const grid = new Float32Array((nx + 1) * (nz + 1))
  for (let iz = 0; iz <= nz; iz += 1) {
    for (let ix = 0; ix <= nx; ix += 1) {
      grid[iz * (nx + 1) + ix] = islandField(minX + ix * cell, minZ + iz * cell)
    }
  }
  const at = (ix: number, iz: number) => grid[iz * (nx + 1) + ix]

  const cut = (ax: number, az: number, av: number, bx: number, bz: number, bv: number) => {
    const t = av / (av - bv)
    return new THREE.Vector2(ax + (bx - ax) * t, az + (bz - az) * t)
  }

  const segs: Seg[] = []
  for (let iz = 0; iz < nz; iz += 1) {
    for (let ix = 0; ix < nx; ix += 1) {
      const x0 = minX + ix * cell
      const z0 = minZ + iz * cell
      const x1 = x0 + cell
      const z1 = z0 + cell
      const v00 = at(ix, iz)
      const v10 = at(ix + 1, iz)
      const v11 = at(ix + 1, iz + 1)
      const v01 = at(ix, iz + 1)
      const code =
        (v00 > 0 ? 1 : 0) | (v10 > 0 ? 2 : 0) | (v11 > 0 ? 4 : 0) | (v01 > 0 ? 8 : 0)
      const edges = MS_EDGES[code]
      if (edges.length === 0) continue
      const point = (e: number) => {
        if (e === 0) return cut(x0, z0, v00, x1, z0, v10)
        if (e === 1) return cut(x1, z0, v10, x1, z1, v11)
        if (e === 2) return cut(x1, z1, v11, x0, z1, v01)
        return cut(x0, z1, v01, x0, z0, v00)
      }
      for (let i = 0; i < edges.length; i += 2) {
        segs.push([point(edges[i]), point(edges[i + 1])])
      }
    }
  }

  // 端点を突き合わせて一番長い閉ループを拾う
  const key = (p: THREE.Vector2) => `${Math.round(p.x * 64)},${Math.round(p.y * 64)}`
  const incident = new Map<string, Seg[]>()
  for (const seg of segs) {
    for (const p of seg) {
      const k = key(p)
      const list = incident.get(k)
      if (list) list.push(seg)
      else incident.set(k, [seg])
    }
  }

  const used = new Set<Seg>()
  let longest: THREE.Vector2[] = []
  for (const seed of segs) {
    if (used.has(seed)) continue
    used.add(seed)
    const loop = [seed[0], seed[1]]
    let end = seed[1]
    for (let guard = 0; guard < segs.length + 4; guard += 1) {
      const next = (incident.get(key(end)) ?? []).find((s) => !used.has(s))
      if (!next) break
      used.add(next)
      const other = key(next[0]) === key(end) ? next[1] : next[0]
      loop.push(other)
      end = other
    }
    if (loop.length > longest.length) longest = loop
  }

  if (longest.length < 12) {
    // 保険：万一輪郭が取れなければ大きな円に落とす
    return Array.from({ length: 64 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2
      return new THREE.Vector2(Math.cos(a) * 30, Math.sin(a) * 30 + 4)
    })
  }
  return longest
}

/** 角を落として手描きの海岸線に近づける */
function chaikin(points: THREE.Vector2[], iterations: number) {
  let pts = points
  for (let it = 0; it < iterations; it += 1) {
    const out: THREE.Vector2[] = []
    for (let i = 0; i < pts.length; i += 1) {
      const a = pts[i]
      const b = pts[(i + 1) % pts.length]
      out.push(new THREE.Vector2(a.x * 0.75 + b.x * 0.25, a.y * 0.75 + b.y * 0.25))
      out.push(new THREE.Vector2(a.x * 0.25 + b.x * 0.75, a.y * 0.25 + b.y * 0.75))
    }
    pts = out
  }
  return pts
}

let cachedOutline: THREE.Vector2[] | null = null

export function islandOutline() {
  if (!cachedOutline) {
    const raw = extractOutline()
    const thinned = raw.filter((_, i) => i % 2 === 0)
    cachedOutline = chaikin(thinned, 2)
  }
  return cachedOutline
}

/* ---------- 高さ：跳ぶ意味のある段差 ---------- */

export type Platform = {
  x: number
  z: number
  top: number
  /** 円形なら r、矩形なら hw/hd */
  r?: number
  hw?: number
  hd?: number
  /** true なら地形として盛り上がりを描画する */
  mound?: boolean
}

/** 自動で登れる段差の上限。これを超える段は跳ばないと上がれない */
export const STEP_UP = 1.35

export const PLATFORMS: Platform[] = [
  // 展望台（頭の高台）: 二段で登れる
  { x: 0, z: -38, r: 9.5, top: 1.25, mound: true },
  { x: 0, z: -38, r: 6, top: 2.5, mound: true },
  // 左耳の高台。最後の一段だけ跳ばないと届かない
  { x: -6.5, z: -42, r: 1.8, top: 1.2, mound: true },
  { x: -8.2, z: -44.6, r: 1.8, top: 2.2, mound: true },
  { x: -9.5, z: -47, r: 4.2, top: 3.6, mound: true },
  // 右耳
  { x: 6.5, z: -42, r: 1.8, top: 1.2, mound: true },
  { x: 8.2, z: -44.6, r: 1.8, top: 2.2, mound: true },
  { x: 9.5, z: -47, r: 4.2, top: 3.6, mound: true },
  // 桟橋のデッキ（見た目は props 側の板。PIER と位置を合わせること）
  { x: -12, z: 21, hw: 1.9, hd: 2.7, top: 0.35 },
  // 展望台の床板
  { x: 0, z: -38, r: 3.1, top: 2.74 },
]

function onPlatform(p: Platform, x: number, z: number) {
  if (p.r !== undefined) return Math.hypot(x - p.x, z - p.z) < p.r
  return Math.abs(x - p.x) < (p.hw ?? 0) && Math.abs(z - p.z) < (p.hd ?? 0)
}

export function groundHeightAt(x: number, z: number) {
  let h = 0
  for (const p of PLATFORMS) {
    if (p.top > h && onPlatform(p, x, z)) h = p.top
  }
  return h
}

/** PLATFORMS のうち地形扱いのものを実際の丘として描く（当たりと見た目を必ず一致させる） */
export function buildMounds() {
  const group = new THREE.Group()
  const grassTop = toonMat(COLORS.grass)
  const rockSide = toonMat(COLORS.rock)
  for (const p of PLATFORMS) {
    if (!p.mound || p.r === undefined) continue
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(p.r, p.r + 0.35, p.top, 14),
      [rockSide, grassTop, rockSide],
    )
    cyl.position.set(p.x, p.top / 2, p.z)
    cyl.castShadow = true
    cyl.receiveShadow = true
    group.add(cyl)
  }
  return group
}

/* ---------- 島本体 ---------- */

export function buildIsland() {
  const group = new THREE.Group()
  const outline = islandOutline()

  // ExtrudeGeometry は形状平面の +Z へ押し出す。rotation.x = -90° で
  // 押し出し方向が世界の +Y になるので、形状の y に -worldZ を入れておく。
  const shape = new THREE.Shape(outline.map((p) => new THREE.Vector2(p.x, -p.y)))
  const depth = 7
  const bevel = 0.7
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  })
  const land = new THREE.Mesh(geo, [toonMat(COLORS.grass), toonMat(COLORS.soil)])
  land.rotation.x = -Math.PI / 2
  land.position.y = -(depth + bevel) // 天面を y = 0 に合わせる
  land.receiveShadow = true
  land.castShadow = false
  group.add(land)

  // 島の裏側にぶら下がる岩塊
  const rootRock = toonMat(COLORS.soilDeep)
  const roots: [number, number, number, number][] = [
    [0, 4, 15, 20], [0, -32, 11, 15], [-14, 18, 8, 11],
    [15, 16, 8, 11], [30, 28, 5, 8], [41, 8, 4, 7], [0, -46, 6, 8],
  ]
  for (const [x, z, r, h] of roots) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), rootRock)
    cone.position.set(x, -depth - h / 2 + 1, z)
    cone.rotation.y = x * 1.7
    group.add(cone)
  }

  // 芝の濃淡と参道（地面のべた塗りを避ける）
  const patchGeo = new THREE.CircleGeometry(1, 10)
  const patchMat = toonMat(COLORS.grassDark)
  const rand = mulberry32(20260720)
  const patchTransforms: THREE.Matrix4[] = []
  const patchRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  for (let i = 0; i < 120; i += 1) {
    const x = -28 + rand() * 76
    const z = -54 + rand() * 94
    if (islandField(x, z) < 3) continue
    const scale = 1.4 + rand() * 2.6
    patchTransforms.push(new THREE.Matrix4().compose(
      new THREE.Vector3(x, 0.015, z),
      patchRotation,
      new THREE.Vector3(scale, scale, scale),
    ))
  }
  const patches = new THREE.InstancedMesh(patchGeo, patchMat, patchTransforms.length)
  patchTransforms.forEach((matrix, index) => patches.setMatrixAt(index, matrix))
  patches.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  patches.computeBoundingSphere()
  group.add(patches)

  // 中央広場から各区画へ伸びる飛び石
  const stoneGeo = new THREE.CylinderGeometry(0.62, 0.66, 0.12, 7)
  const stoneMat = toonMat(COLORS.path)
  // 出生地は島の南端。参道はすべて北（前方）へ伸び、鳥居だけが背後にある
  const routes: [number, number][][] = [
    [[0, 32], [0, 35]],                                        // 鳥居へ（背後）
    [[-3, 24.5], [-6, 23], [-9, 22.5], [-11, 23.5]],           // 池・桟橋へ
    [[3, 24.5], [6, 21.5], [9, 18.5], [11, 16.5]],             // 工房へ
    [[-4, 18], [-7, 12], [-10, 6], [-12.5, 1]],                // 縁側へ
    [[4, 17], [7, 11], [10, 4], [12.5, -3]],                   // 研究塔へ
    [[-1.5, 12], [-3, 3], [-4, -6], [-4.8, -15]],              // 連絡へ
    [[0, 20], [0, 12], [0, 4], [0, -5], [0, -13], [0, -21], [0, -27], [0, -32]], // 展望台へ
    [[8, 26], [14, 26.5], [20, 27.5], [26, 28.5]],             // 尻尾（年輪の道）へ
  ]
  const stoneTransforms: THREE.Matrix4[] = []
  for (const route of routes) {
    for (const [x, z] of route) {
      const rotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, (x * 13.7 + z * 7.1) % Math.PI, 0),
      )
      stoneTransforms.push(new THREE.Matrix4().compose(
        new THREE.Vector3(x, 0.06, z),
        rotation,
        new THREE.Vector3(1, 1, 1),
      ))
    }
  }
  const stones = new THREE.InstancedMesh(stoneGeo, stoneMat, stoneTransforms.length)
  stoneTransforms.forEach((matrix, index) => stones.setMatrixAt(index, matrix))
  stones.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  stones.receiveShadow = true
  stones.computeBoundingSphere()
  group.add(stones)

  return group
}

/* ---------- 雲海と空 ---------- */

export function buildClouds() {
  const group = new THREE.Group()
  const mat = toonMat(COLORS.cloud).clone()
  mat.vertexColors = true
  const rand = mulberry32(0x5eac10d)
  const geo = new THREE.SphereGeometry(1, 8, 6)
  const cloudCount = 116
  const clouds = new THREE.InstancedMesh(geo, mat, cloudCount)
  const matrix = new THREE.Matrix4()
  const rotation = new THREE.Quaternion()
  const cloudColor = new THREE.Color(COLORS.cloud)
  const shadeColor = new THREE.Color(COLORS.cloudShade)
  let index = 0

  // 島の下に広がる雲の海
  for (let i = 0; i < 90; i += 1) {
    const a = rand() * Math.PI * 2
    const dist = 8 + rand() * 130
    const position = new THREE.Vector3(
      Math.cos(a) * dist + 6, -26 - rand() * 16, Math.sin(a) * dist - 4,
    )
    const scale = new THREE.Vector3(9 + rand() * 16, 3.4 + rand() * 3, 9 + rand() * 16)
    matrix.compose(position, rotation, scale)
    clouds.setMatrixAt(index, matrix)
    clouds.setColorAt(index, rand() > 0.65 ? shadeColor : cloudColor)
    index += 1
  }
  // 遠景に浮かぶ雲（視線の高さ）
  for (let i = 0; i < 26; i += 1) {
    const a = rand() * Math.PI * 2
    const dist = 120 + rand() * 90
    matrix.compose(
      new THREE.Vector3(Math.cos(a) * dist, -6 + rand() * 34, Math.sin(a) * dist),
      rotation,
      new THREE.Vector3(14 + rand() * 20, 4 + rand() * 5, 14 + rand() * 20),
    )
    clouds.setMatrixAt(index, matrix)
    clouds.setColorAt(index, cloudColor)
    index += 1
  }
  clouds.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  clouds.computeBoundingSphere()
  group.add(clouds)
  return group
}

export type Sky = { mesh: THREE.Mesh; material: THREE.ShaderMaterial }

export function buildSky(): Sky {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      topColor: { value: new THREE.Color(COLORS.skyTop) },
      bottomColor: { value: new THREE.Color(COLORS.skyBottom) },
    },
    vertexShader: `
      varying vec3 vWorld;
      void main() {
        vWorld = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      varying vec3 vWorld;
      void main() {
        float h = normalize(vWorld + vec3(0.0, 60.0, 0.0)).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), 0.75)), 1.0);
      }
    `,
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(320, 32, 16), material)
  mesh.frustumCulled = false
  return { mesh, material }
}

/** 陽の光にきらめく塵（島の上をゆっくり漂う） */
export function buildMotes() {
  const count = 110
  const positions = new Float32Array(count * 3)
  const phase = new Float32Array(count)
  const rand = mulberry32(77123)
  for (let i = 0; i < count; i += 1) {
    const a = rand() * Math.PI * 2
    const d = rand() * 46
    positions[i * 3] = Math.cos(a) * d + 4
    positions[i * 3 + 1] = 1 + rand() * 10
    positions[i * 3 + 2] = Math.sin(a) * d - 4
    phase[i] = rand() * Math.PI * 2
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.2,
      map: makeDotTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      color: COLORS.pale,
    }),
  )
  return { points, phase }
}
