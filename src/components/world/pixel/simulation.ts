import type { PixelSnapshot, Point, WorldInput, WorldMap, WorldSpot, WorldState } from './world-types.ts'

const PLAYER_RADIUS = 6
const SPEED = 78
const GRID = 8
const CAST_WAIT = 1.4
const BITE_WINDOW = 4
const EPSILON = 1e-8

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
const finitePoint = (point: Point) => Number.isFinite(point.x) && Number.isFinite(point.y)

/** The cat's conservative six-pixel footprint is shared by walking and routing. */
export function canStand(map: WorldMap, x: number, y: number): boolean {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false
  const { bounds } = map
  if (x < bounds.x + PLAYER_RADIUS || y < bounds.y + PLAYER_RADIUS
    || x > bounds.x + bounds.w - PLAYER_RADIUS || y > bounds.y + bounds.h - PLAYER_RADIUS) return false
  return !map.obstacles.some(rect => x > rect.x - PLAYER_RADIUS && x < rect.x + rect.w + PLAYER_RADIUS
    && y > rect.y - PLAYER_RADIUS && y < rect.y + rect.h + PLAYER_RADIUS)
}

function clearSegment(map: WorldMap, start: Point, end: Point): boolean {
  const steps = Math.max(1, Math.ceil(distance(start, end) / 2))
  for (let n = 0; n <= steps; n++) {
    const t = n / steps
    if (!canStand(map, start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t)) return false
  }
  return true
}

/** Eight-pixel routing, including swept edge checks so diagonal corners stay solid. */
export function findPath(map: WorldMap, start: Point, end: Point): Point[] {
  if (!finitePoint(start) || !finitePoint(end) || !canStand(map, start.x, start.y)) return []
  const { bounds } = map
  if (end.x < bounds.x || end.y < bounds.y || end.x > bounds.x + bounds.w || end.y > bounds.y + bounds.h) return []
  if (clearSegment(map, start, end)) return distance(start, end) > EPSILON ? [{ ...end }] : []

  const left = bounds.x + PLAYER_RADIUS, top = bounds.y + PLAYER_RADIUS
  const columns = Math.floor((bounds.w - PLAYER_RADIUS * 2) / GRID) + 1
  const rows = Math.floor((bounds.h - PLAYER_RADIUS * 2) / GRID) + 1
  const size = columns * rows
  if (columns <= 0 || rows <= 0) return []
  const pointAt = (index: number): Point => ({ x: left + index % columns * GRID, y: top + Math.floor(index / columns) * GRID })
  const valid = new Uint8Array(size)
  const parent = new Int32Array(size).fill(-2)
  const queue: number[] = []
  for (let i = 0; i < size; i++) {
    const point = pointAt(i)
    valid[i] = Number(canStand(map, point.x, point.y))
    if (valid[i] && distance(point, start) <= GRID * 2 && clearSegment(map, start, point)) queue.push(i)
  }
  queue.sort((a, b) => distance(pointAt(a), start) - distance(pointAt(b), start))
  for (const index of queue) parent[index] = -1

  const exactTarget = canStand(map, end.x, end.y)
  let target = -1, closest = Infinity
  for (let head = 0; head < queue.length; head++) {
    const current = queue[head], point = pointAt(current)
    const targetDistance = distance(point, end)
    if (exactTarget && targetDistance <= GRID * 2 && clearSegment(map, point, end)) {
      target = current
      break
    }
    if (!exactTarget && targetDistance <= 32 && targetDistance < closest) {
      target = current
      closest = targetDistance
    }
    const cx = current % columns, cy = Math.floor(current / columns)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if ((!dx && !dy) || cx + dx < 0 || cy + dy < 0 || cx + dx >= columns || cy + dy >= rows) continue
        const next = current + dy * columns + dx
        if (!valid[next] || parent[next] !== -2 || !clearSegment(map, point, pointAt(next))) continue
        parent[next] = current
        queue.push(next)
      }
    }
  }
  if (target < 0) return []
  const route: Point[] = []
  for (let index = target; index >= 0; index = parent[index]) route.push(pointAt(index))
  route.reverse()
  if (exactTarget && distance(route[route.length - 1], end) > EPSILON) route.push({ ...end })
  while (route.length && distance(route[0], start) < EPSILON) route.shift()
  return route
}

function nearestSpot(state: WorldState, map: WorldMap): WorldSpot | undefined {
  let nearest: WorldSpot | undefined, closest = Infinity
  for (const spot of map.spots) {
    const separation = distance(state.player, spot)
    if (separation <= spot.radius && separation < closest) {
      nearest = spot
      closest = separation
    }
  }
  state.nearbyId = nearest?.id ?? null
  return nearest
}

function stop(state: WorldState) {
  state.player.vx = 0
  state.player.vy = 0
  state.player.moving = false
  state.path = []
}

function discover(state: WorldState, id: string) {
  if (!state.discovered.includes(id)) state.discovered.push(id)
  state.activeId = id
  stop(state)
}

export function createWorldState(map: WorldMap, discovered: unknown = []): WorldState {
  const ids = new Set(map.spots.map(spot => spot.id))
  const saved = Array.isArray(discovered) ? discovered.filter((id): id is string => typeof id === 'string' && ids.has(id)) : []
  const state: WorldState = {
    player: { ...map.spawn, vx: 0, vy: 0, facing: 'down', moving: false, step: 0 },
    time: 0, paused: false, nearbyId: null, activeId: null,
    discovered: [...new Set(saved)], fishing: 'idle', fishingTimer: 0, notice: null, path: [],
  }
  nearestSpot(state, map)
  return state
}

function movePlayer(state: WorldState, input: Point, dt: number, map: WorldMap) {
  const magnitude = Math.hypot(input.x, input.y)
  const scale = magnitude > 1 ? 1 / magnitude : 1
  let vx = input.x * scale * SPEED, vy = input.y * scale * SPEED
  let destination: Point | undefined
  if (magnitude > EPSILON) state.path = []
  else {
    while (state.path.length && distance(state.player, state.path[0]) < .05) state.path.shift()
    destination = state.path[0]
    if (destination) {
      const dx = destination.x - state.player.x, dy = destination.y - state.player.y
      const remaining = Math.hypot(dx, dy)
      const speed = Math.min(SPEED, remaining / dt)
      vx = dx / remaining * speed
      vy = dy / remaining * speed
    }
  }
  const startX = state.player.x, startY = state.player.y
  const count = Math.max(1, Math.ceil(Math.max(Math.abs(vx), Math.abs(vy)) * dt / 2))
  for (let i = 0; i < count; i++) {
    const nextX = state.player.x + vx * dt / count
    if (canStand(map, nextX, state.player.y)) state.player.x = nextX
    const nextY = state.player.y + vy * dt / count
    if (canStand(map, state.player.x, nextY)) state.player.y = nextY
  }
  state.player.vx = (state.player.x - startX) / dt
  state.player.vy = (state.player.y - startY) / dt
  state.player.moving = Math.hypot(state.player.vx, state.player.vy) > EPSILON
  if (state.player.moving) {
    state.player.facing = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 'right' : 'left') : (vy > 0 ? 'down' : 'up')
    state.player.step += dt * 9
    state.notice = null
  }
  if (destination && distance(state.player, destination) < .05) state.path.shift()
}

/** Mutates only serializable simulation state. dt is seconds and capped at 100ms. */
export function stepWorld(state: WorldState, input: WorldInput, dt: number, map: WorldMap): void {
  if (state.paused) return
  if (!Number.isFinite(dt) || dt <= 0) {
    stop(state)
    return
  }
  dt = Math.min(dt, .1)
  if (state.activeId) {
    stop(state)
    return
  }
  state.time += dt
  nearestSpot(state, map)
  if (state.fishing === 'waiting' || state.fishing === 'bite') {
    stop(state)
    state.fishingTimer += dt
    if (state.fishing === 'waiting' && state.fishingTimer + EPSILON >= CAST_WAIT) {
      state.fishing = 'bite'
      state.fishingTimer = Math.max(0, state.fishingTimer - CAST_WAIT)
    } else if (state.fishing === 'bite' && state.fishingTimer + EPSILON >= BITE_WINDOW) {
      state.fishing = 'idle'
      state.fishingTimer = 0
      state.notice = 'missed'
    }
    return
  }
  movePlayer(state, finitePoint(input) ? input : { x: 0, y: 0 }, dt, map)
  nearestSpot(state, map)
}

/** A semantic direction-button activation, without a pointer/key hold lifecycle. */
export function nudgeWorld(state: WorldState, input: WorldInput, map: WorldMap): void {
  if (state.paused || state.activeId || state.fishing === 'waiting' || state.fishing === 'bite') return
  stop(state)
  stepWorld(state, input, .1, map)
  stop(state)
}

export function interactWorld(state: WorldState, map: WorldMap): void {
  if (state.paused || state.activeId) return
  const spot = nearestSpot(state, map)
  if (!spot) return
  stop(state)
  if (spot.kind !== 'pond') {
    state.notice = null
    discover(state, spot.id)
  } else if (state.fishing === 'waiting') {
    state.fishing = 'idle'
    state.fishingTimer = 0
    state.notice = 'early'
  } else if (state.fishing === 'bite') {
    state.fishing = 'caught'
    state.fishingTimer = 0
    state.notice = 'caught'
    discover(state, spot.id)
  } else {
    state.fishing = 'waiting'
    state.fishingTimer = 0
    state.notice = null
  }
}

export function closeInteraction(state: WorldState): void {
  state.activeId = null
  state.fishing = 'idle'
  state.fishingTimer = 0
  state.notice = null
  stop(state)
}

export function openDiscovered(state: WorldState, id: string, map: WorldMap): void {
  if (!state.discovered.includes(id) || !map.spots.some(spot => spot.id === id)) return
  closeInteraction(state)
  state.activeId = id
}

export function setDestination(state: WorldState, target: Point, map: WorldMap): void {
  if (state.paused || state.activeId || state.fishing === 'waiting' || state.fishing === 'bite') return
  state.path = findPath(map, state.player, target)
}

export function snapshotWorld(state: WorldState): PixelSnapshot {
  const { path, ...snapshot } = state
  return { ...snapshot, player: { ...state.player }, discovered: [...state.discovered], destination: path.length ? { ...path[path.length - 1] } : null }
}
