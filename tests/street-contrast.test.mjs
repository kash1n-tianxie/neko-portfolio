import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const css = readFileSync(new URL('../src/components/works/street-works.css', import.meta.url), 'utf8')
const globals = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8')
function declarations(source, selector) {
  const result = {}
  for (const rule of source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]+;/g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!rule[1].trim().split(',').map(v => v.trim()).includes(selector)) continue
    for (const pair of rule[2].split(';')) {
      const colon = pair.indexOf(':')
      if (colon > 0) result[pair.slice(0, colon).trim()] = pair.slice(colon + 1).trim()
    }
  }
  return result
}
const luma = hex => hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0)
for (const palette of ['blue-yellow', 'red-black']) {
  const tokens = { ...declarations(globals, ':root'), ...(palette === 'red-black' ? declarations(globals, "[data-palette='red-black']") : {}) }
  for (const selector of ['.street-works__eyebrow > span:first-child', '.street-works__select > a > span', '.manga-home .street-works .works-archive-heading__label', '.street-works__github:hover']) {
    test(`${palette}: ${selector} small text has 4.5:1 contrast`, () => {
      const color = declarations(css, selector).color.replace(/var\((--[\w-]+)\)/g, (_, name) => tokens[name])
      const [a, b] = [luma(color), luma(tokens['--scene-bg'])].sort((a, b) => b - a)
      assert.ok((a + .05) / (b + .05) >= 4.5, `${color} on ${tokens['--scene-bg']}`)
    })
  }
}
test('filter counts do not dilute their on-accent contrast', () => {
  assert.equal(declarations(css, '.manga-home .street-works .works-filter span').opacity, '1')
})
