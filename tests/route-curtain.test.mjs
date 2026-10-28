import assert from 'node:assert/strict'
import test from 'node:test'
import { getCurtainOutcome, getTransitionDestination } from '../src/components/motion/route-curtain.ts'

const navigation = {
  currentHref: 'https://neko.example/ja',
  href: 'https://neko.example/ja/world',
  target: '',
  download: false,
  defaultPrevented: false,
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
}

// Catch accidentally intercepting native gestures or missing ordinary world links.
test('an unmodified internal navigation is eligible immediately', () => {
  assert.equal(getTransitionDestination(navigation), '/ja/world')
})

test('same-page query changes remain native instead of waiting for a pathname change', () => {
  assert.equal(getTransitionDestination({ ...navigation, href: 'https://neko.example/ja?view=all' }), null)
})

for (const gesture of [
  { button: 1 }, { metaKey: true }, { ctrlKey: true },
  { shiftKey: true }, { altKey: true }, { defaultPrevented: true },
  { target: '_blank' }, { target: 'preview' }, { download: true },
  { href: 'https://elsewhere.example/ja/world' },
  { href: 'https://neko.example/ja#works' },
  { href: 'https://neko.example/ja/works/game#play' },
  { href: 'https://neko.example/ja' },
  { href: 'mailto:cat@example.com' }, { href: 'http://[' },
]) {
  test(`native behavior is preserved for ${JSON.stringify(gesture)}`, () => {
    assert.equal(getTransitionDestination({ ...navigation, ...gesture }), null)
  })
}

const waiting = {
  destinationPath: '/ja/world',
  currentPath: '/ja/world',
  waitForWorld: true,
  readyPath: null,
  elapsedMs: 1,
  timeoutMs: 10000,
  failed: false,
}

// Catch reporting readiness on route mount instead of a successfully rendered frame.
test('world mount alone does not uncover the curtain', () => {
  assert.equal(getCurtainOutcome(waiting), 'pending')
})

test('a matching first rendered world frame uncovers the curtain', () => {
  assert.equal(getCurtainOutcome({ ...waiting, readyPath: '/ja/world' }), 'ready')
})

test('stale ready events from a different world do not uncover', () => {
  assert.equal(getCurtainOutcome({ ...waiting, readyPath: '/en/world' }), 'pending')
})

test('readiness cannot uncover the source page before the route changes', () => {
  assert.equal(getCurtainOutcome({ ...waiting, currentPath: '/ja', readyPath: '/ja/world' }), 'pending')
})

test('ordinary project routes uncover after their route is mounted', () => {
  assert.equal(getCurtainOutcome({ ...waiting, waitForWorld: false }), 'ready')
})

test('a slow world is recoverable at the timeout boundary', () => {
  assert.equal(getCurtainOutcome({ ...waiting, elapsedMs: 9999 }), 'pending')
  assert.equal(getCurtainOutcome({ ...waiting, elapsedMs: 10000 }), 'timeout')
})

test('a failed world is revealed for its recovery link without waiting', () => {
  assert.equal(getCurtainOutcome({ ...waiting, failed: true }), 'failed')
})
