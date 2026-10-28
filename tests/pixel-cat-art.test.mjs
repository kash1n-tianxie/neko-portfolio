import assert from 'node:assert/strict'
import test from 'node:test'
let art = {}
try { art = await import('../src/components/world/pixel/cat-sprites.ts') } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error }

test('cat art has four complete directions with a shared foot anchor and bounded pixel palette', () => {
  assert.equal(typeof art.catSprite, 'function')
  for (const direction of ['up', 'down', 'left', 'right']) {
    const sprite = art.catSprite(direction, 0, false)
    assert.equal(sprite.length, 24)
    assert.ok(sprite.every(row => row.length === 28))
    assert.match(sprite.join(''), /^[.Obhswren]+$/)
    assert.ok(sprite.join('').includes('O'))
  }
  assert.ok(art.catSprite('down', 0, false).join('').includes('e'), 'front-facing cat has bright, readable eyes')
  assert.ok(!art.catSprite('up', 0, false).join('').includes('e'), 'back-facing cat has no face')
})

test('cat walking changes its paws while idle stays still and left mirrors right', () => {
  assert.equal(typeof art.catSprite, 'function')
  const still = art.catSprite('left', 0, false)
  assert.deepEqual(art.catSprite('left', 20, false), still)
  assert.deepEqual(art.catSprite('right', 0, false), still.map(row => [...row].reverse().join('')))
  const frames = Array.from({ length: 4 }, (_, phase) => art.catSprite('left', phase, true).join('\n'))
  assert.equal(new Set(frames).size, 4)
})
