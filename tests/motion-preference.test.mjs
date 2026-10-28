import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveMotionPreference, resolveEffectiveMotionPreference } from '../src/components/motion/motion-preference.ts'

// A saved "on" must never override a system-level accessibility preference.
for (const saved of [null, 'on', 'off', 'invalid', '']) {
  test(`system reduced motion wins over saved ${JSON.stringify(saved)}`, () => {
    assert.equal(resolveMotionPreference(saved, true), true)
  })
}

test('saved off disables motion without a system preference', () => {
  assert.equal(resolveMotionPreference('off', false), true)
})

test('saved on allows motion without a system preference', () => {
  assert.equal(resolveMotionPreference('on', false), false)
})

for (const saved of [null, 'invalid', '', 'OFF']) {
  test(`missing or unrecognized preference ${JSON.stringify(saved)} allows motion`, () => {
    assert.equal(resolveMotionPreference(saved, false), false)
  })
}

test('in-session OFF wins when storage cannot save the preference', () => {
  assert.equal(resolveEffectiveMotionPreference('on', false, 'off'), true)
})

test('in-session ON wins over stale saved OFF when storage is blocked', () => {
  assert.equal(resolveEffectiveMotionPreference('off', false, 'on'), false)
})

test('system reduction still wins over an in-session ON', () => {
  assert.equal(resolveEffectiveMotionPreference('on', true, 'on'), true)
})

test('missing root state falls back to saved preference', () => {
  assert.equal(resolveEffectiveMotionPreference('off', false, null), true)
})

test('invalid root state does not discard saved reduction', () => {
  assert.equal(resolveEffectiveMotionPreference('off', false, 'invalid'), true)
})
