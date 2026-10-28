import assert from 'node:assert/strict'
import test from 'node:test'

let art = {}
try { art = await import('../src/components/motion/cat-art.ts') } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error }

test('gaze at the eye center is neutral, and nearby motion is proportional', () => {
  assert.equal(typeof art.gazeVector, 'function')
  assert.deepEqual(art.gazeVector(0, 0), { x: 0, y: 0 })
  assert.deepEqual(art.gazeVector(120, 0), { x: .5, y: 0 })
  assert.deepEqual(art.gazeVector(0, -60), { x: 0, y: -.25 })
})

test('extreme pointer positions stay inside a unit ellipse in every direction', () => {
  assert.equal(typeof art.gazeVector, 'function')
  for (const [x, y] of [[1e6, 0], [-1e6, 0], [0, 1e6], [0, -1e6], [1e6, 1e6], [-1e6, -1e6]]) {
    const offset = art.gazeVector(x, y)
    assert.ok(Math.hypot(offset.x, offset.y) <= 1 + 1e-12)
    assert.equal(Math.sign(offset.x), Math.sign(x))
    assert.equal(Math.sign(offset.y), Math.sign(y))
  }
})

test('invalid pointer geometry resets eyes safely instead of emitting NaN', () => {
  assert.equal(typeof art.gazeVector, 'function')
  for (const [x, y] of [[NaN, 10], [10, Infinity], [-Infinity, 10]]) assert.deepEqual(art.gazeVector(x, y), { x: 0, y: 0 })
})

test('each palette uses its own art with two registered eyes within the square canvas', () => {
  assert.ok(art.catArt)
  const blue = art.catArt['blue-yellow'], red = art.catArt['red-black']
  assert.notEqual(blue.src, red.src)
  for (const variant of [blue, red]) {
    assert.equal(variant.eyes.length, 2)
    for (const eye of variant.eyes) {
      assert.ok(eye.x > 300 && eye.x < 700)
      assert.ok(eye.y > 300 && eye.y < 450)
      assert.ok(eye.travelX <= 12 && eye.travelY <= 10)
      assert.ok(eye.clip.startsWith('M'))
    }
    assert.ok(variant.eyes[0].x < variant.eyes[1].x)
  }
})
