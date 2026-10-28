import test from 'node:test'
import assert from 'node:assert/strict'

let streetSceneFrame = () => null
try { ({ streetSceneFrame } = await import('../src/components/motion/street-scene-frame.ts')) } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error }

test('street paint follows reversible scroll progress with no playback queue', () => {
  assert.deepEqual(streetSceneFrame(0, 1280), { x: -44, y: 28 })
  assert.deepEqual(streetSceneFrame(.5, 1280), { x: 0, y: 0 })
  assert.deepEqual(streetSceneFrame(1, 1280), { x: 44, y: -28 })
  const forward = [.1, .35, .8].map(p => streetSceneFrame(p, 1280))
  assert.deepEqual([.8, .35, .1].map(p => streetSceneFrame(p, 1280)).reverse(), forward)
})
test('mobile paint stays restrained and invalid geometry produces a readable neutral state', () => {
  assert.deepEqual(streetSceneFrame(0, 390), { x: -18, y: 14 })
  assert.deepEqual(streetSceneFrame(1, 390), { x: 18, y: -14 })
  assert.deepEqual(streetSceneFrame(NaN, 390), { x: 0, y: 0 })
  assert.deepEqual(streetSceneFrame(5, 1280), streetSceneFrame(1, 1280))
  assert.deepEqual(streetSceneFrame(-4, 1280), streetSceneFrame(0, 1280))
})
