import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const source = readFileSync(new URL('../src/components/world/pixel-palette.tsx', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
} }).outputText

function setup({ saved, theme, blocked = false, server = false, locale = 'en' } = {}) {
  const values = new Map([['neko-theme', 'hiru'], ['neko-palette', 'red-black']])
  if (saved !== undefined) values.set('neko-pixel-palette', saved)
  const dataset = Object.freeze({ theme, palette: 'portfolio-palette' })
  const window = new EventTarget()
  const context = {
    exports: {}, window, Event,
    document: server ? undefined : { documentElement: { dataset } },
    localStorage: {
      getItem: key => { if (blocked) throw Error('blocked'); return values.get(key) ?? null },
      setItem: (key, value) => { if (blocked) throw Error('blocked'); values.set(key, value) },
    },
    require: name => name === 'react' ? {
      useSyncExternalStore: (subscribe, getSnapshot, getServerSnapshot) => {
        context.subscribe = subscribe
        return server ? getServerSnapshot() : getSnapshot()
      },
    } : name === 'next-intl' ? { useLocale: () => locale } : require(name),
  }
  vm.runInNewContext(compiled, context)
  return { api: context.exports, context, values, window, dataset }
}

test('only recognized independent choices override the portfolio-derived default', () => {
  const { api } = setup()
  assert.equal(api.resolvePixelPalette('red-black', 'hiru'), 'red-black')
  assert.equal(api.resolvePixelPalette('blue-yellow', 'yoru'), 'blue-yellow')
  for (const invalid of [null, '', 'hiru', 'yoru', 'RED-BLACK']) {
    assert.equal(api.resolvePixelPalette(invalid, 'yoru'), 'red-black')
    assert.equal(api.resolvePixelPalette(invalid, 'hiru'), 'blue-yellow')
    assert.equal(api.resolvePixelPalette(invalid), 'blue-yellow')
  }
})

test('constructor getter reads the saved town palette before the hook mounts', () => {
  const { api } = setup({ saved: 'red-black', theme: 'hiru' })
  assert.equal(api.getPixelPalette(), 'red-black')
  assert.equal(api.usePixelPalette()[0], 'red-black')
})

test('switching town colors leaves root attributes and global storage untouched', () => {
  const { api, values, dataset } = setup({ theme: 'hiru' })
  api.setPixelPalette('red-black')
  assert.equal(api.getPixelPalette(), 'red-black')
  assert.equal(values.get('neko-pixel-palette'), 'red-black')
  assert.equal(values.get('neko-theme'), 'hiru')
  assert.equal(values.get('neko-palette'), 'red-black')
  assert.equal(dataset.theme, 'hiru')
  assert.equal(dataset.palette, 'portfolio-palette')
})

test('blocked storage retains an in-session choice', () => {
  const { api } = setup({ blocked: true, theme: 'yoru' })
  assert.equal(api.getPixelPalette(), 'red-black')
  api.setPixelPalette('blue-yellow')
  assert.equal(api.getPixelPalette(), 'blue-yellow')
})

test('server snapshot is stable without browser globals', () => {
  const { api } = setup({ server: true })
  assert.equal(api.getPixelPalette(), 'blue-yellow')
  assert.equal(api.usePixelPalette()[0], 'blue-yellow')
})

test('hook observes local changes and only town storage events, then cleans up', () => {
  const { api, context, window } = setup({ theme: 'hiru' })
  api.usePixelPalette()
  let notifications = 0
  const unsubscribe = context.subscribe(() => notifications++)
  api.setPixelPalette('red-black')
  assert.equal(notifications, 1)
  const storage = (key, newValue) => {
    const event = new Event('storage')
    Object.assign(event, { key, newValue })
    window.dispatchEvent(event)
  }
  storage('neko-theme', 'yoru')
  storage('neko-palette', 'blue-yellow')
  assert.equal(notifications, 1)
  assert.equal(api.getPixelPalette(), 'red-black')
  storage('neko-pixel-palette', 'blue-yellow')
  assert.equal(notifications, 2)
  assert.equal(api.getPixelPalette(), 'blue-yellow')
  storage('neko-pixel-palette', 'red-black')
  storage(null, null)
  assert.equal(api.getPixelPalette(), 'blue-yellow')
  unsubscribe()
  const before = notifications
  api.setPixelPalette('red-black')
  storage('neko-pixel-palette', 'blue-yellow')
  assert.equal(notifications, before)
  assert.equal(api.getPixelPalette(), 'red-black')
})

test('compact toggle has localized names and switches the local preference', () => {
  for (const locale of ['ja', 'en']) {
    const { api } = setup({ locale, saved: 'blue-yellow' })
    const button = api.PixelPaletteToggle()
    assert.match(button.props['aria-label'], locale === 'ja' ? /町の配色.*青と黄/ : /town palette.*blue and yellow/)
    button.props.onClick()
    assert.equal(api.getPixelPalette(), 'red-black')
  }
})

test('world wrapper only imports the scoped control and keeps accessibility affordances', () => {
  const world = readFileSync(new URL('../src/components/world/pixel-world.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(world, /from ['"]\.\.\/(?:theme-toggle|palette-store)['"]/)
  assert.match(world, /palette: getPixelPalette\(\)/)
  assert.match(world, /setPalette\(palette\)/)
  assert.match(world, /data-palette=\{palette\}/)
  assert.match(world, /\.site-nav, \.skip-link/)
  assert.match(world, /element\.inert = inert/)
  assert.match(world, /aria-live="assertive"/)
  assert.match(world, /event\.detail === 0/)
  assert.match(world, /gameRef\.current\?\.nudge/)
})
