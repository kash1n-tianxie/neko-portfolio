import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as preferences from '../src/components/palette-preference.ts'

function loadModule(path, dependencies, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022,
  } }).outputText
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, ...globals,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  })
  return exports
}

function browserStore({ initial = 'blue-yellow', saved = initial, blocked = false } = {}) {
  const root = { dataset: { palette: initial, motion: 'off' } }
  const window = new EventTarget()
  window.matchMedia = () => Object.assign(new EventTarget(), { matches: false })
  const values = new Map([['neko-palette', saved]])
  let writes = 0
  let subscribe
  const store = loadModule('../src/components/palette-store.ts', {
    react: { useSyncExternalStore(fn, snapshot) { subscribe = fn; return snapshot() } },
    './palette-preference': preferences,
  }, {
    document: { documentElement: root }, window, Event,
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Blocked'); return values.get(key) ?? null },
      setItem(key, value) { if (blocked) throw new Error('Blocked'); writes++; values.set(key, value) },
    },
  })
  store.usePalette()
  const unsubscribe = subscribe(() => {})
  const storage = (key, newValue) => {
    values.set(key, newValue)
    const event = new Event('storage')
    Object.assign(event, { key, newValue })
    window.dispatchEvent(event)
  }
  return { store, root, storage, unsubscribe, writes: () => writes }
}

test('navigation cannot erase the current session palette', () => {
  const { store, root } = browserStore()
  store.setPalette('red-black')
  delete root.dataset.palette
  assert.equal(store.getPalette(), 'red-black')
  assert.equal(typeof store.reconcilePalette, 'function')
  store.reconcilePalette()
  assert.equal(root.dataset.palette, 'red-black')
})

test('blocked persistence and stale saved colors cannot replace a session choice', () => {
  const { store, root } = browserStore({ blocked: true })
  store.setPalette('red-black')
  root.dataset.palette = 'blue-yellow'
  assert.equal(store.getPalette(), 'red-black')
  assert.equal(typeof store.reconcilePalette, 'function')
  store.reconcilePalette()
  assert.equal(root.dataset.palette, 'red-black')
})

test('same-color selection repairs the root without saving again', () => {
  const { store, root, writes } = browserStore({ initial: 'red-black' })
  delete root.dataset.palette
  store.setPalette('red-black')
  assert.equal(root.dataset.palette, 'red-black')
  assert.equal(writes(), 0)
})

test('storage updates replace session state and survive the next navigation', () => {
  const { store, root, storage } = browserStore({ initial: 'red-black' })
  storage('neko-palette', 'blue-yellow')
  assert.equal(store.getPalette(), 'blue-yellow')
  root.dataset.palette = 'red-black'
  assert.equal(store.getPalette(), 'blue-yellow')
  assert.equal(typeof store.reconcilePalette, 'function')
  store.reconcilePalette()
  assert.equal(root.dataset.palette, 'blue-yellow')
})

test('a readable storage event works even when direct storage access is blocked', () => {
  const { store, storage } = browserStore({ blocked: true })
  storage('neko-palette', 'red-black')
  assert.equal(store.getPalette(), 'red-black')
})

test('navigation reconciliation does not write persistence or start an animation', () => {
  const { store, root, writes } = browserStore({ initial: 'red-black' })
  assert.equal(typeof store.reconcilePalette, 'function')
  root.dataset.motion = 'on'
  delete root.dataset.palette
  store.reconcilePalette()
  assert.equal(root.dataset.palette, 'red-black')
  assert.equal(writes(), 0)
  // There is no document.createElement in this fixture: an animated wipe would throw.
})

test('Nav reconciles before paint with both locale and pathname dependencies', () => {
  const { store, root } = browserStore({ initial: 'red-black' })
  const effects = []
  const { Nav } = loadModule('../src/components/nav.tsx', {
    react: {
      useEffect() {}, useLayoutEffect(callback, dependencies) { effects.push({ callback, dependencies }) },
      useRef: () => ({ current: null }), useState: value => [value, () => {}],
    },
    'react/jsx-runtime': { jsx: () => null, jsxs: () => null },
    'next-intl': { useLocale: () => 'en', useTranslations: () => key => key },
    '@/i18n/navigation': { usePathname: () => '/works/example', Link: () => null },
    './theme-toggle': { ThemeToggle: () => null },
    './locale-toggle': { LocaleToggle: () => null },
    './motion/motion-preference': {},
    '@/content/site-navigation': { homeNavigation: [] },
    './palette-store': store,
    './nav-manga.css': {},
  })
  Nav()
  assert.ok(effects.some(({ dependencies }) => dependencies.includes('en') && dependencies.includes('/works/example')))
  delete root.dataset.palette
  effects.forEach(({ callback }) => callback())
  assert.equal(root.dataset.palette, 'red-black')
})
