import assert from 'node:assert/strict'
import test from 'node:test'
import { chapterLinkageFrame } from '../src/components/motion/chapter-linkage-frame.ts'

test('chapter entrance has visible diagonal heading and opposing decorative motion', () => {
  const entry = chapterLinkageFrame(0, 1280)
  assert.ok(entry.headingX >= 60)
  assert.ok(entry.headingY >= 50)
  assert.ok(entry.headingRotate < 0)
  assert.ok(entry.motifX > 0)
  assert.ok(entry.motifY < 0)
  assert.ok(entry.motifOpacity >= 0.3)
})

test('reading position settles the actual heading without hiding it', () => {
  const reading = chapterLinkageFrame(1, 1280)
  assert.equal(reading.headingX, 0)
  assert.equal(reading.headingY, 0)
  assert.equal(reading.headingRotate, 0)
  assert.equal(reading.motifX, 0)
  assert.equal(reading.motifY, 0)
  assert.ok(reading.motifOpacity >= 0.3)
})

test('heading and motif follow the same local progress in either scroll direction', () => {
  const entry = chapterLinkageFrame(0, 1280)
  const middle = chapterLinkageFrame(0.5, 1280)
  assert.equal(middle.headingX, entry.headingX / 2)
  assert.equal(middle.headingY, entry.headingY / 2)
  assert.equal(middle.motifX, entry.motifX / 2)
  assert.equal(middle.motifY, entry.motifY / 2)

  const down = [0, 0.25, 0.5, 0.75, 1].map(p => chapterLinkageFrame(p, 1280))
  const up = [1, 0.75, 0.5, 0.25, 0].map(p => chapterLinkageFrame(p, 1280))
  assert.deepEqual(down, up.reverse())
})

test('small-screen motion stays meaningful without pushing headings far sideways', () => {
  const mobile = chapterLinkageFrame(0, 320)
  assert.ok(mobile.headingX >= 20 && mobile.headingX <= 32)
  assert.ok(mobile.headingY >= 36 && mobile.headingY <= 52)
  assert.ok(mobile.motifX <= 42)
})

test('overscroll clamps to the corresponding chapter endpoint', () => {
  assert.deepEqual(chapterLinkageFrame(-2, 1280), chapterLinkageFrame(0, 1280))
  assert.deepEqual(chapterLinkageFrame(3, 1280), chapterLinkageFrame(1, 1280))
})

test('invalid measurements fall back to the readable settled heading', () => {
  for (const p of [NaN, Infinity, -Infinity]) {
    const frame = chapterLinkageFrame(p, 1280)
    assert.equal(frame.headingX, 0)
    assert.equal(frame.headingY, 0)
    assert.ok(Object.values(frame).every(Number.isFinite))
  }
  assert.ok(Object.values(chapterLinkageFrame(0.5, NaN)).every(Number.isFinite))
})
