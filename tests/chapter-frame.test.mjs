import test from 'node:test'
import assert from 'node:assert/strict'
import { chapterFrame } from '../src/components/motion/chapter-frame.ts'
import * as chapterMotion from '../src/components/motion/chapter-frame.ts'

test('keeps the initial page uncovered and safely clamps invalid progress', () => {
  const start = { departure: 0, slash: -130, arrival: 0, wordShift: 16 }
  assert.deepEqual(chapterFrame(0), start)
  assert.deepEqual(chapterFrame(-2), start)
  assert.deepEqual(chapterFrame(Number.NaN), start)
})

test('covers the departing page at midpoint before revealing the chapter label', () => {
  const frame = chapterFrame(0.5)
  assert.equal(frame.departure, 1)
  assert.equal(frame.slash, 0)
  assert.equal(frame.arrival, 0)
})

test('fast scroll reaches the readable final state with no curtain remaining', () => {
  const end = { departure: 1, slash: 130, arrival: 1, wordShift: 0 }
  assert.deepEqual(chapterFrame(1), end)
  assert.deepEqual(chapterFrame(4), end)
})

test('reverse scroll resolves directly to its position without a playback queue', () => {
  chapterFrame(0.9)
  assert.equal(chapterFrame(0).departure, 0)
  assert.equal(chapterFrame(0.5).slash, 0)
  assert.equal(chapterFrame(0).arrival, 0)
})

test('leaves a readable destination hold before the sticky scene releases', () => {
  for (const progress of [0.78, 0.9, 1]) {
    assert.deepEqual(chapterFrame(progress), { departure: 1, slash: 130, arrival: 1, wordShift: 0 })
  }
})

test('keeps a full scroll-controlled cut on a short desktop window', () => {
  assert.deepEqual(chapterMotion.chapterLayout?.(780, 500), {
    stickyTop: -280, startOffset: 280, travel: 500, height: 1280,
  })
})

test('allows a tall compact hero to be read before its transition starts', () => {
  assert.deepEqual(chapterMotion.chapterLayout?.(1240, 844), {
    stickyTop: -396, startOffset: 396, travel: 844, height: 2084,
  })
})

test('keeps the normal desktop scene pinned at the top', () => {
  assert.deepEqual(chapterMotion.chapterLayout?.(720, 720), {
    stickyTop: 0, startOffset: 0, travel: 720, height: 1440,
  })
})
