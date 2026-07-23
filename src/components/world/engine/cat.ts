import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { COLORS, addOutline, outlineInk, toonMat } from './materials'

type LegName = 'fl' | 'fr' | 'bl' | 'br'

export type CatRig = {
  root: THREE.Group
  body: THREE.Group
  head: THREE.Group
  earL: THREE.Mesh
  earR: THREE.Mesh
  legs: Record<LegName, THREE.Group>
  tail: THREE.Group[]
  pupilL: THREE.Mesh
  pupilR: THREE.Mesh
  pupilBase: { x: number; y: number; z: number }
  rod: THREE.Group
  rodTip: THREE.Object3D
}

export type CatPose = 'idle' | 'walk' | 'run' | 'jump' | 'fishing' | 'nap'

const BODY_Y = 0.48
const HEAD_X = 0.47
const HEAD_Y = 0.17
const EAR_TILT = 0.1
const TAIL_CURVE = [0.22, 0.31, 0.35, 0.26, 0.08, -0.11]

const fur = toonMat(0x34393c)
const furLight = toonMat(0x474f53)
const furDark = toonMat(0x24282b)
const cream = toonMat(0xf1eee5)
const accent = toonMat(COLORS.accent)
const innerEar = toonMat(0x8c706b)
const blush = toonMat(0x9b7771)

function block(
  size: [number, number, number],
  material: THREE.Material,
  position: [number, number, number],
  outline = 0,
) {
  const radius = Math.min(...size) * 0.28
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 2, radius), material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  if (outline > 1) addOutline(mesh, outline, outlineInk)
  return mesh
}

function pyramid(
  radius: number,
  height: number,
  material: THREE.Material,
  position: [number, number, number],
  outline = 0,
) {
  const mesh = new THREE.Mesh(new THREE.ConeGeometry(radius, height, 4), material)
  mesh.position.set(...position)
  mesh.rotation.y = Math.PI / 4
  mesh.castShadow = true
  if (outline > 1) addOutline(mesh, outline, outlineInk)
  return mesh
}

function addWhiskers(head: THREE.Group) {
  const material = new THREE.LineBasicMaterial({
    color: COLORS.pale,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  })
  for (const side of [-1, 1]) {
    for (let index = 0; index < 3; index += 1) {
      const y = -0.07 - index * 0.04
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0.258, y, side * 0.11),
        new THREE.Vector3(0.31, y + (1 - index) * 0.016, side * (0.28 + index * 0.025)),
      ])
      head.add(new THREE.Line(geometry, material))
    }
  }
}

function buildLeg(x: number, z: number, front: boolean) {
  const pivot = new THREE.Group()
  pivot.position.set(x, 0.36, z)
  pivot.add(block(
    [front ? 0.14 : 0.16, 0.27, 0.155],
    front ? fur : furDark,
    [0, -0.13, 0],
    1.03,
  ))
  pivot.add(block([0.22, 0.11, 0.18], fur, [0.065, -0.295, 0], 1.035))
  pivot.add(block([0.075, 0.115, 0.19], cream, [0.145, -0.295, 0], 1.03))
  return pivot
}

function buildTail(body: THREE.Group) {
  const segments: THREE.Group[] = []
  const lengths = [0.17, 0.16, 0.15, 0.14, 0.12, 0.1]
  let parent: THREE.Object3D = body

  lengths.forEach((length, index) => {
    const segment = new THREE.Group()
    segment.position.set(index === 0 ? -0.36 : -lengths[index - 1], index === 0 ? 0.08 : 0, index === 0 ? 0.12 : 0)
    segment.rotation.z = TAIL_CURVE[index]
    segment.add(block(
      [length, Math.max(0.07, 0.1 - index * 0.006), Math.max(0.07, 0.105 - index * 0.006)],
      index === lengths.length - 1 ? cream : index > 3 ? furLight : fur,
      [-length / 2, 0, 0],
      1.03,
    ))
    parent.add(segment)
    parent = segment
    segments.push(segment)
  })

  return segments
}

/** 外部モデルを使わない、地面を四足で歩く Three.js の幼猫。 */
export function buildCat(): CatRig {
  const root = new THREE.Group()
  root.scale.setScalar(0.9)

  const contactShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.5, 28),
    new THREE.MeshBasicMaterial({
      color: 0x101214,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  contactShadow.rotation.x = -Math.PI / 2
  contactShadow.position.set(-0.02, 0.012, 0)
  contactShadow.scale.set(1.45, 0.72, 1)
  root.add(contactShadow)

  const body = new THREE.Group()
  body.position.y = BODY_Y
  root.add(body)

  // 横長の胴体と少し大きな腰。背中の輪郭だけで四足の猫と分かる比率。
  body.add(block([0.72, 0.34, 0.42], fur, [0, 0, 0], 1.04))
  body.add(block([0.3, 0.37, 0.44], fur, [-0.25, 0.01, 0], 1.035))
  body.add(block([0.28, 0.06, 0.43], cream, [0.28, 0.11, 0], 1.025))
  body.add(block([0.035, 0.18, 0.22], cream, [0.37, -0.07, 0], 1.02))

  const head = new THREE.Group()
  head.position.set(HEAD_X, HEAD_Y, 0)
  body.add(head)
  head.add(block([0.48, 0.46, 0.54], fur, [0, 0, 0], 1.045))

  const earL = pyramid(0.16, 0.29, fur, [-0.04, 0.33, -0.165], 1.04)
  earL.rotation.x = EAR_TILT
  head.add(earL)
  const earR = pyramid(0.16, 0.29, fur, [-0.04, 0.33, 0.165], 1.04)
  earR.rotation.x = -EAR_TILT
  head.add(earR)
  const innerL = pyramid(0.09, 0.17, innerEar, [0.085, 0.315, -0.165])
  innerL.rotation.x = EAR_TILT
  head.add(innerL)
  const innerR = pyramid(0.09, 0.17, innerEar, [0.085, 0.315, 0.165])
  innerR.rotation.x = -EAR_TILT
  head.add(innerR)

  const eyeSize: [number, number, number] = [0.035, 0.18, 0.16]
  head.add(block(eyeSize, cream, [0.255, 0.055, -0.14], 1.02))
  head.add(block(eyeSize, cream, [0.255, 0.055, 0.14], 1.02))
  const pupilBase = { x: 0.278, y: 0.045, z: 0.14 }
  const pupilL = block([0.026, 0.085, 0.057], furDark, [pupilBase.x, pupilBase.y, -pupilBase.z])
  const pupilR = block([0.026, 0.085, 0.057], furDark, [pupilBase.x, pupilBase.y, pupilBase.z])
  head.add(pupilL, pupilR)
  head.add(block([0.018, 0.03, 0.026], cream, [0.294, 0.082, -0.119]))
  head.add(block([0.018, 0.03, 0.026], cream, [0.294, 0.082, 0.161]))

  head.add(block([0.052, 0.135, 0.16], cream, [0.257, -0.11, -0.072]))
  head.add(block([0.052, 0.135, 0.16], cream, [0.257, -0.11, 0.072]))
  head.add(block([0.052, 0.05, 0.073], innerEar, [0.296, -0.073, 0], 1.025))
  head.add(block([0.018, 0.052, 0.085], blush, [0.279, -0.105, -0.2]))
  head.add(block([0.018, 0.052, 0.085], blush, [0.279, -0.105, 0.2]))
  addWhiskers(head)

  const legs: Record<LegName, THREE.Group> = {
    fl: buildLeg(0.27, -0.16, true),
    fr: buildLeg(0.27, 0.16, true),
    bl: buildLeg(-0.27, -0.17, false),
    br: buildLeg(-0.27, 0.17, false),
  }
  root.add(legs.fl, legs.fr, legs.bl, legs.br)

  const tail = buildTail(body)

  const rod = new THREE.Group()
  rod.position.set(0.48, 0.57, 0.22)
  rod.rotation.z = 0.62
  rod.visible = false
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.023, 1.65, 7),
    toonMat(COLORS.wood),
  )
  pole.position.y = 0.82
  pole.castShadow = true
  rod.add(pole)
  rod.add(block([0.07, 0.2, 0.07], accent, [0, 0.08, 0], 1.03))
  const rodTip = new THREE.Object3D()
  rodTip.position.y = 1.65
  rod.add(rodTip)
  root.add(rod)

  return { root, body, head, earL, earR, legs, tail, pupilL, pupilR, pupilBase, rod, rodTip }
}

function resetPose(rig: CatRig) {
  rig.body.position.y = BODY_Y
  rig.body.rotation.set(0, 0, 0)
  rig.body.scale.set(1, 1, 1)
  rig.head.rotation.set(0, 0, 0)
  Object.values(rig.legs).forEach((leg) => leg.rotation.set(0, 0, 0))
  rig.earL.rotation.set(EAR_TILT, Math.PI / 4, 0)
  rig.earR.rotation.set(-EAR_TILT, Math.PI / 4, 0)
  rig.tail.forEach((segment, index) => segment.rotation.set(0, 0, TAIL_CURVE[index]))
}

function waveTail(rig: CatRig, t: number, amount: number, speed: number, lift = 0) {
  rig.tail.forEach((segment, index) => {
    segment.rotation.z = TAIL_CURVE[index] + lift * (1 - index / rig.tail.length)
    segment.rotation.y = Math.sin(t * speed - index * 0.55) * amount * (0.45 + index * 0.11)
  })
}

export function animateCat(rig: CatRig, pose: CatPose, t: number, walkSpeed: number) {
  resetPose(rig)

  if (pose === 'walk') {
    const cycle = t * 6.5
    const amount = 0.3 * Math.min(walkSpeed, 1)
    // 四拍の小さな足運び。常に三本近くが接地するので、幼猫らしく安定して見える。
    rig.legs.fl.rotation.z = Math.sin(cycle) * amount
    rig.legs.br.rotation.z = Math.sin(cycle + Math.PI / 2) * amount
    rig.legs.fr.rotation.z = Math.sin(cycle + Math.PI) * amount
    rig.legs.bl.rotation.z = Math.sin(cycle + Math.PI * 1.5) * amount
    rig.body.position.y = BODY_Y + Math.abs(Math.sin(cycle * 2)) * 0.018
    rig.body.rotation.z = Math.sin(cycle) * 0.012
    rig.head.rotation.z = -Math.sin(cycle) * 0.02
    waveTail(rig, t, 0.18, 3.4, 0.08)
    return
  }

  if (pose === 'run') {
    const cycle = t * 10.8
    const front = Math.sin(cycle) * 0.52
    const back = -Math.sin(cycle) * 0.55
    rig.legs.fl.rotation.z = front
    rig.legs.fr.rotation.z = front
    rig.legs.bl.rotation.z = back
    rig.legs.br.rotation.z = back
    rig.body.position.y = BODY_Y + Math.abs(Math.sin(cycle)) * 0.045
    rig.body.rotation.z = -0.055 + Math.sin(cycle * 2) * 0.018
    rig.head.rotation.z = 0.045
    waveTail(rig, t, 0.13, 5.6, -0.08)
    return
  }

  if (pose === 'jump') {
    rig.legs.fl.rotation.z = 0.68
    rig.legs.fr.rotation.z = 0.68
    rig.legs.bl.rotation.z = -0.65
    rig.legs.br.rotation.z = -0.65
    rig.body.position.y = BODY_Y + 0.035
    rig.body.rotation.z = -0.11
    rig.head.rotation.z = 0.08
    waveTail(rig, t, 0.08, 5, -0.22)
    return
  }

  if (pose === 'fishing') {
    rig.body.position.y = BODY_Y - 0.075 + Math.sin(t * 2) * 0.007
    rig.body.rotation.z = 0.12
    rig.legs.bl.rotation.z = -0.95
    rig.legs.br.rotation.z = -0.95
    rig.legs.fl.rotation.z = 0.16
    rig.legs.fr.rotation.z = 0.16
    rig.head.rotation.z = -0.17
    waveTail(rig, t, 0.22, 1.35, 0.14)
    return
  }

  if (pose === 'nap') {
    rig.body.position.y = BODY_Y - 0.15 + Math.sin(t * 1.7) * 0.006
    rig.body.scale.y = 0.82
    rig.legs.fl.rotation.z = 1.08
    rig.legs.fr.rotation.z = 1.08
    rig.legs.bl.rotation.z = -1.08
    rig.legs.br.rotation.z = -1.08
    rig.head.rotation.z = -0.2
    waveTail(rig, t, 0.07, 0.75, 0.22)
    return
  }

  rig.body.position.y = BODY_Y + Math.sin(t * 2.15) * 0.009
  rig.body.scale.y = 1 + Math.sin(t * 2.15) * 0.006
  const twitch = Math.max(0, Math.sin(t * 0.82)) ** 28
  rig.earL.rotation.x = EAR_TILT + twitch * 0.22
  rig.earR.rotation.x = -EAR_TILT - twitch * 0.07
  waveTail(rig, t, 0.25, 1.25, 0.1)
}
