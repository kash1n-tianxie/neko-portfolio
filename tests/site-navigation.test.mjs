import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

let navigation = []
try { ({ homeNavigation: navigation } = await import('../src/content/site-navigation.ts')) } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error }

test('the public homepage navigation has only Works and Contact chapters', () => {
  assert.deepEqual(navigation.map(item => item.id), ['works', 'contact'])
  assert.deepEqual(navigation.map(item => item.key), ['works', 'contact'])
})

test('homepage no longer renders personal information chapters', async () => {
  const page = await readFile(new URL('../src/app/[locale]/page.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(page, /<(?:Skills|About)\b/)
  assert.match(page, /<Works\s*\/>/)
  assert.match(page, /<Contact\s*\/>/)
})

test('Hero menu no longer sends visitors to removed sections', async () => {
  const hero = await readFile(new URL('../src/components/sections/hero.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(hero, /href=["']#(?:about|skills)["']/)
  assert.match(hero, /href=["']#contact["']/)
})
