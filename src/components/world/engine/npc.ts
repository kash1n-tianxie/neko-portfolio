import * as THREE from 'three'
import { COLORS, addOutline, outlineInk, toonMat } from './materials'

export type Npc = {
  id: string
  group: THREE.Group
  /** 話しかけられるまで漂う目印 */
  marker: THREE.Mesh
  head?: THREE.Object3D
  spin?: THREE.Object3D
}

function marker() {
  const m = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.045, 6, 16),
    new THREE.MeshBasicMaterial({ color: COLORS.accent }),
  )
  m.rotation.x = Math.PI / 2
  return m
}

/** おすわりした猫の NPC。主人公と同じ骨格言語だが、静止していて色が違う */
export function buildNpcCat(id: string, color: number, markerY: number): Npc {
  const group = new THREE.Group()
  const mat = toonMat(color)

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.33, 0.2, 6, 12), mat)
  body.position.y = 0.42
  body.scale.set(1.08, 1.05, 0.95)
  body.castShadow = true
  addOutline(body, 1.05, outlineInk)
  group.add(body)

  const head = new THREE.Group()
  head.position.set(0, 1.02, 0)
  group.add(head)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), mat)
  skull.castShadow = true
  addOutline(skull, 1.06, outlineInk)
  head.add(skull)

  const earGeo = new THREE.ConeGeometry(0.11, 0.2, 4)
  for (const z of [-0.15, 0.15]) {
    const ear = new THREE.Mesh(earGeo, mat)
    ear.position.set(0, 0.28, z)
    ear.rotation.x = z > 0 ? 0.15 : -0.15
    addOutline(ear, 1.12, outlineInk)
    head.add(ear)
  }

  const eyeMat = new THREE.MeshBasicMaterial({ color: COLORS.pale })
  const pupilMat = new THREE.MeshBasicMaterial({ color: COLORS.ink })
  for (const z of [-0.11, 0.11]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), eyeMat)
    eye.position.set(0.22, 0.04, z)
    eye.scale.set(0.5, 1, 1)
    head.add(eye)
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), pupilMat)
    pupil.position.set(0.26, 0.04, z)
    head.add(pupil)
  }

  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.46, 4, 8), mat)
  tail.position.set(-0.38, 0.34, 0)
  tail.rotation.z = -0.85
  addOutline(tail, 1.12, outlineInk)
  group.add(tail)

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.034, 6, 16), toonMat(COLORS.accent))
  collar.position.y = 0.78
  collar.rotation.x = Math.PI / 2
  group.add(collar)

  const mk = marker()
  mk.position.y = markerY
  group.add(mk)

  return { id, group, marker: mk, head }
}

/** 研究塔の観測体：三つの意思決定主体を見比べている存在 */
export function buildAgent(id: string): Npc {
  const group = new THREE.Group()

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), toonMat(COLORS.pale))
  core.position.y = 1.15
  core.castShadow = true
  addOutline(core, 1.1, outlineInk)
  group.add(core)

  const spin = new THREE.Group()
  spin.position.y = 1.15
  group.add(spin)
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.028, 6, 26),
      new THREE.MeshBasicMaterial({ color: i === 1 ? COLORS.accent : COLORS.ink }),
    )
    ring.rotation.x = Math.PI / 2 + i * 0.7
    ring.rotation.z = i * 1.1
    spin.add(ring)
  }

  const mk = marker()
  mk.position.y = 2.1
  group.add(mk)

  return { id, group, marker: mk, spin }
}

/** NPC の待機モーション */
export function animateNpc(npc: Npc, t: number, catPos: THREE.Vector3) {
  npc.marker.position.y += Math.sin(t * 2 + npc.group.position.x) * 0.0016
  npc.marker.rotation.z = t * 1.4

  if (npc.spin) {
    npc.spin.rotation.y = t * 0.6
    npc.spin.rotation.x = Math.sin(t * 0.4) * 0.3
    npc.spin.position.y = 1.15 + Math.sin(t * 1.3) * 0.09
  }

  if (npc.head) {
    // 近づいた相手の方をゆるく見る
    const dx = catPos.x - npc.group.position.x
    const dz = catPos.z - npc.group.position.z
    const dist = Math.hypot(dx, dz)
    if (dist < 7) {
      const want = Math.atan2(-dz, dx) - npc.group.rotation.y
      let diff = want - npc.head.rotation.y
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      npc.head.rotation.y += diff * 0.06
    } else {
      npc.head.rotation.y *= 0.94
    }
    npc.head.position.y = 1.02 + Math.sin(t * 1.8 + npc.group.position.z) * 0.012
  }
}
