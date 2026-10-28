import assert from 'node:assert/strict'
import test from 'node:test'

let sim = {}
try { sim = await import('../src/components/world/pixel/simulation.ts') } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error }
function api(name) {
  assert.equal(typeof sim[name], 'function', `${name} must be implemented`)
  return sim[name]
}
const spot = (id, kind, x, y, radius = 25) => ({ id, kind, x, y, radius, name: { en: id, ja: id }, title: { en: id, ja: id }, lines: { en: [id], ja: [id] } })
const fixture = () => ({ width: 256, height: 192, spawn: { x: 32, y: 96 }, bounds: { x: 0, y: 0, w: 256, h: 192 }, obstacles: [{ x: 112, y: 40, w: 24, h: 100 }], spots: [spot('friend', 'npc', 40, 96), spot('pond', 'pond', 40, 150), spot('board', 'board', 220, 96)] })
const create = (map, saved) => api('createWorldState')(map, saved)
const step = (state, input, dt, map) => api('stepWorld')(state, input, dt, map)
const advance = (state, seconds, map, input = { x: 0, y: 0 }) => { for (let n = 0; n < Math.round(seconds * 60); n++) step(state, input, 1 / 60, map) }
const interact = (state, map) => api('interactWorld')(state, map)

test('accessible direction activation makes one collision-safe step without leaving movement held', () => {
  const map = fixture(), state = create(map)
  api('nudgeWorld')(state, { x: 1, y: 0 }, map)
  assert.ok(Math.abs(state.player.x - 39.8) < 1e-8)
  assert.equal(state.player.moving, false)
  assert.equal(state.player.vx, 0)
  state.player.x = 105
  api('nudgeWorld')(state, { x: 1, y: 0 }, map)
  assert.ok(state.player.x <= 106.00001)
  state.paused = true
  const previousX = state.player.x
  api('nudgeWorld')(state, { x: -1, y: 0 }, map)
  assert.equal(state.player.x, previousX)
})

test('saved discoveries are unique, known strings and do not mutate the source save', () => {
  const map = fixture(), saved = ['friend', 'friend', 'bad', null, 42, 'pond']
  const state = create(map, saved)
  assert.deepEqual(state.discovered, ['friend', 'pond'])
  assert.equal(saved.length, 6)
  assert.equal(state.nearbyId, 'friend')
  assert.equal(state.activeId, null)
  assert.deepEqual(JSON.parse(JSON.stringify(state)), state)
})

test('cardinal movement is immediate and diagonal movement is normalized', () => {
  const map = fixture(), cardinal = create(map), diagonal = create(map)
  step(cardinal, { x: 1, y: 0 }, .1, map)
  step(diagonal, { x: 1, y: 1 }, .1, map)
  assert.ok(Math.abs(cardinal.player.x - 39.8) < 1e-8)
  assert.ok(Math.abs(Math.hypot(diagonal.player.x - 32, diagonal.player.y - 96) - 7.8) < 1e-8)
  assert.equal(cardinal.player.facing, 'right')
  assert.equal(cardinal.player.moving, true)
  step(cardinal, { x: 0, y: 0 }, .1, map)
  assert.equal(cardinal.player.vx, 0)
  assert.equal(cardinal.player.moving, false)
})

test('nonfinite movement inputs are neutral and invalid time cannot poison state', () => {
  const map = fixture(), state = create(map)
  for (const dt of [NaN, Infinity, -1, 0]) step(state, { x: 1, y: 0 }, dt, map)
  assert.equal(state.player.x, 32)
  assert.equal(state.time, 0)
  step(state, { x: NaN, y: Infinity }, .1, map)
  assert.equal(state.player.x, 32)
  assert.equal(state.player.y, 96)
  step(state, { x: 1, y: 0 }, 9999, map)
  assert.ok(state.player.x <= 39.8 + 1e-8, 'a delayed frame must not teleport')
  assert.ok(Number.isFinite(state.time))
})

test('radius-aware collision respects bounds and supports sliding along walls', () => {
  const map = fixture(), state = create(map)
  state.player.x = 104
  advance(state, .7, map, { x: 1, y: 1 })
  assert.ok(state.player.x <= 106.00001)
  assert.ok(state.player.y > 130)
  advance(state, .3, map, { x: 1, y: 1 })
  assert.ok(state.player.y > 140)
  state.player.x = 8
  state.player.y = 8
  advance(state, 1, map, { x: -1, y: -1 })
  assert.ok(state.player.x >= 6)
  assert.ok(state.player.y >= 6)
  assert.equal(api('canStand')(map, 112, 80), false)
  assert.equal(api('canStand')(map, 2, 80), false)
  assert.equal(api('canStand')(map, NaN, 80), false)
  assert.equal(api('canStand')(map, 32, 96), true)
})

test('interaction uses current distance, selects nearest and cannot trigger from far away', () => {
  const map = fixture(), state = create(map)
  state.player.x = 180
  state.nearbyId = 'friend'
  interact(state, map)
  assert.equal(state.activeId, null)
  assert.deepEqual(state.discovered, [])
  state.player.x = 40
  state.player.y = 96
  map.spots.push(spot('closer', 'npc', 41, 96))
  interact(state, map)
  assert.equal(state.activeId, 'friend')
  assert.deepEqual(state.discovered, ['friend'])
})

test('dialogue freezes movement and close clears velocity and destination', () => {
  const map = fixture(), state = create(map)
  api('setDestination')(state, { x: 80, y: 96 }, map)
  interact(state, map)
  const position = { x: state.player.x, y: state.player.y }
  step(state, { x: 1, y: 1 }, .1, map)
  assert.deepEqual({ x: state.player.x, y: state.player.y }, position)
  assert.equal(state.player.moving, false)
  api('closeInteraction')(state)
  assert.equal(state.activeId, null)
  assert.equal(state.player.vx, 0)
  assert.equal(state.player.vy, 0)
  assert.deepEqual(state.path, [])
  assert.equal(state.fishing, 'idle')
})

test('paused state prevents time, player and fishing progression', () => {
  const map = fixture(), state = create(map)
  state.player.y = 150
  interact(state, map)
  state.paused = true
  const before = JSON.stringify(state)
  advance(state, 2, map, { x: 1, y: 1 })
  assert.equal(JSON.stringify(state), before)
})

test('early fishing reel resets the attempt with retry feedback', () => {
  const map = fixture(), state = create(map)
  state.player.y = 150
  interact(state, map)
  assert.equal(state.fishing, 'waiting')
  assert.equal(state.activeId, null)
  advance(state, .5, map, { x: 1, y: 0 })
  assert.equal(state.player.x, 32, 'casting anchors the player')
  interact(state, map)
  assert.equal(state.fishing, 'idle')
  assert.equal(state.notice, 'early')
  assert.deepEqual(state.discovered, [])
  interact(state, map)
  assert.equal(state.fishing, 'waiting')
  assert.equal(state.notice, null)
})

test('a missed bite resets fishing without collecting and can be attempted again', () => {
  const map = fixture(), state = create(map)
  state.player.y = 150
  interact(state, map)
  advance(state, 1.5, map)
  assert.equal(state.fishing, 'bite')
  advance(state, 2.1, map)
  assert.equal(state.fishing, 'bite', 'the bite remains long enough to hear the cue and respond')
  advance(state, 2, map)
  assert.equal(state.fishing, 'idle')
  assert.equal(state.notice, 'missed')
  assert.deepEqual(state.discovered, [])
  interact(state, map)
  assert.equal(state.fishing, 'waiting')
})

test('reeling within the bite window collects pond once and opens its entry', () => {
  const map = fixture(), state = create(map)
  state.player.y = 150
  interact(state, map)
  advance(state, 1.6, map)
  interact(state, map)
  assert.equal(state.fishing, 'caught')
  assert.equal(state.notice, 'caught')
  assert.equal(state.activeId, 'pond')
  assert.deepEqual(state.discovered, ['pond'])
  api('closeInteraction')(state)
  interact(state, map)
  advance(state, 1.6, map)
  interact(state, map)
  assert.deepEqual(state.discovered, ['pond'])
})

test('the journal only opens known discovered entries and snapshots are isolated', () => {
  const map = fixture(), state = create(map, ['friend'])
  api('openDiscovered')(state, 'board', map)
  assert.equal(state.activeId, null)
  api('openDiscovered')(state, 'unknown', map)
  assert.equal(state.activeId, null)
  api('openDiscovered')(state, 'friend', map)
  assert.equal(state.activeId, 'friend')
  const snapshot = api('snapshotWorld')(state)
  snapshot.player.x = 200
  snapshot.discovered.push('board')
  assert.equal(state.player.x, 32)
  assert.deepEqual(state.discovered, ['friend'])
  assert.equal(snapshot.destination, null)
  assert.equal('path' in snapshot, false)
})

test('pathfinding routes around walls without cutting through obstacles', () => {
  const map = fixture(), start = { x: 32, y: 96 }, end = { x: 220, y: 96 }
  const path = api('findPath')(map, start, end)
  assert.ok(path.length > 0)
  assert.deepEqual(path.at(-1), end)
  let previous = start
  for (const next of path) {
    const length = Math.hypot(next.x - previous.x, next.y - previous.y)
    for (let n = 0; n <= Math.ceil(length); n++) {
      const t = n / Math.max(1, Math.ceil(length))
      const x = previous.x + (next.x - previous.x) * t, y = previous.y + (next.y - previous.y) * t
      assert.ok(x >= 6 && x <= 250 && y >= 6 && y <= 186)
      assert.ok(!(x > 106 && x < 142 && y > 34 && y < 146), `path crosses padded wall at ${x},${y}`)
    }
    previous = next
  }
})

test('destinations follow the reachable path and manual input cancels it', () => {
  const map = fixture(), state = create(map)
  api('setDestination')(state, { x: 220, y: 96 }, map)
  assert.deepEqual(api('snapshotWorld')(state).destination, { x: 220, y: 96 })
  advance(state, 6, map)
  assert.ok(Math.hypot(state.player.x - 220, state.player.y - 96) < 1)
  assert.equal(state.path.length, 0)
  api('setDestination')(state, { x: 32, y: 96 }, map)
  step(state, { x: -1, y: 0 }, .1, map)
  assert.equal(state.path.length, 0)
})

test('unreachable destinations do not teleport and blocked targets only snap nearby', () => {
  const map = fixture()
  map.obstacles.push({ x: 160, y: 0, w: 16, h: 192 })
  assert.deepEqual(api('findPath')(map, { x: 32, y: 96 }, { x: 220, y: 96 }), [])
  const nearWall = api('findPath')(map, { x: 32, y: 96 }, { x: 115, y: 96 })
  assert.ok(nearWall.length > 0)
  assert.ok(Math.hypot(nearWall.at(-1).x - 115, nearWall.at(-1).y - 96) <= 32)
  assert.deepEqual(api('findPath')(map, { x: 32, y: 96 }, { x: NaN, y: 96 }), [])
  assert.deepEqual(api('findPath')(map, { x: 32, y: 96 }, { x: 500, y: 96 }), [])
})
