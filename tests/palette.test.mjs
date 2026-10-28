import assert from 'node:assert/strict'
import test from 'node:test'
import { resolvePalette, nextPalette, readPalette, savePalette } from '../src/components/palette-preference.ts'

test('new visitors start in blue-yellow', () => {
  assert.equal(resolvePalette(null, null), 'blue-yellow')
})

test('the new preference takes precedence over legacy daylight settings', () => {
  assert.equal(resolvePalette('red-black', 'hiru'), 'red-black')
  assert.equal(resolvePalette('blue-yellow', 'yoru'), 'blue-yellow')
})

test('only absent new preferences migrate the two legacy palettes', () => {
  assert.equal(resolvePalette(null, 'yoru'), 'red-black')
  assert.equal(resolvePalette(null, 'hiru'), 'blue-yellow')
  for (const invalid of ['', 'invalid', 'RED-BLACK', 'yoru']) {
    assert.equal(resolvePalette(invalid, 'yoru'), 'blue-yellow')
  }
})

test('the latest valid session selection wins over stale saved preferences', () => {
  assert.equal(resolvePalette('red-black', null, 'blue-yellow'), 'blue-yellow')
  assert.equal(resolvePalette('blue-yellow', null, 'red-black'), 'red-black')
  assert.equal(resolvePalette('red-black', null, 'invalid'), 'red-black')
})

test('compact and arrow controls cycle through both palettes', () => {
  assert.equal(nextPalette('blue-yellow'), 'red-black')
  assert.equal(nextPalette('red-black'), 'blue-yellow')
})

test('blocked storage preserves session state with a safe first-visit fallback', () => {
  const blocked = () => { throw new Error('Storage blocked') }
  assert.equal(readPalette(blocked), 'blue-yellow')
  assert.equal(readPalette(blocked, 'red-black'), 'red-black')
  assert.doesNotThrow(() => savePalette(blocked, 'red-black'))
})

test('storage readers migrate only when the modern key is absent', () => {
  const values = new Map([['neko-theme', 'yoru']])
  assert.equal(readPalette(key => values.get(key) ?? null), 'red-black')
  values.set('neko-palette', 'invalid')
  assert.equal(readPalette(key => values.get(key) ?? null), 'blue-yellow')
})

test('saving uses the modern key without altering legacy settings', () => {
  const values = new Map([['neko-theme', 'hiru']])
  savePalette((key, value) => values.set(key, value), 'red-black')
  assert.equal(values.get('neko-palette'), 'red-black')
  assert.equal(values.get('neko-theme'), 'hiru')
})
