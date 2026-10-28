import assert from 'node:assert/strict'
import test from 'node:test'
import vm from 'node:vm'
import { readFile } from 'node:fs/promises'
import * as preferences from '../src/components/palette-preference.ts'

test('locale layout leaves the live palette to prepaint and the palette store', async () => {
  const layout = await readFile(new URL('../src/app/[locale]/layout.tsx', import.meta.url), 'utf8')
  const rootTag = layout.match(/<html\b[\s\S]*?>/)?.[0]
  assert.ok(rootTag)
  assert.doesNotMatch(rootTag, /data-palette\s*=/, 'A React-managed default overwrites the live palette during locale navigation')
  assert.match(rootTag, /suppressHydrationWarning/)
  assert.match(layout, /__html: themeScript/)
})

for (const [saved, legacy, expected] of [
  [null, null, 'blue-yellow'],
  ['red-black', 'hiru', 'red-black'],
  ['blue-yellow', 'yoru', 'blue-yellow'],
  [null, 'yoru', 'red-black'],
  [null, 'hiru', 'blue-yellow'],
  ['invalid', 'yoru', 'blue-yellow'],
]) {
  test(`prepaint resolves ${saved}/${legacy} before UI hydration`, () => {
    const values = new Map([['neko-palette', saved], ['neko-theme', legacy]])
    const root = { dataset: { theme: 'hiru' } }
    vm.runInNewContext(preferences.PALETTE_PREPAINT_SCRIPT ?? '', {
      document: { documentElement: root },
      localStorage: {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
      },
    })
    assert.equal(root.dataset.palette, expected)
    assert.equal(root.dataset.theme, undefined)
    assert.equal(values.get('neko-palette'), expected)
  })
}

test('prepaint remains usable when access to localStorage itself is blocked', () => {
  const root = { dataset: {} }
  const context = { document: { documentElement: root } }
  Object.defineProperty(context, 'localStorage', { get() { throw new Error('blocked') } })
  vm.runInNewContext(preferences.PALETTE_PREPAINT_SCRIPT ?? '', context)
  assert.equal(root.dataset.palette, 'blue-yellow')
})

test('blocked persistence does not discard a readable saved palette before paint', () => {
  const root = { dataset: {} }
  vm.runInNewContext(preferences.PALETTE_PREPAINT_SCRIPT, {
    document: { documentElement: root },
    localStorage: {
      getItem: key => key === 'neko-palette' ? 'red-black' : null,
      setItem() { throw new Error('Read-only storage') },
    },
  })
  assert.equal(root.dataset.palette, 'red-black')
})
