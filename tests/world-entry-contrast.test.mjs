import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const entry = readFileSync(new URL('../src/components/sections/world-entry.css', import.meta.url), 'utf8')
const invitation = readFileSync(new URL('../src/components/sections/street-world.css', import.meta.url), 'utf8')
const globals = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8')

function declarations(source, selector) {
  const result = {}
  for (const rule of source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]+;/g, '').matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!rule[1].trim().split(',').map(value => value.trim()).includes(selector)) continue
    for (const pair of rule[2].split(';')) {
      const colon = pair.indexOf(':')
      if (colon > 0) result[pair.slice(0, colon).trim()] = pair.slice(colon + 1).trim()
    }
  }
  return result
}
const rgb = hex => hex.slice(1).match(/../g).map(channel => parseInt(channel, 16) / 255)
const luminance = color => color.map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4)
  .reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0)
function contrast(foreground, background, opacity = 1) {
  const backdrop = rgb(background)
  const blended = rgb(foreground).map((channel, index) => channel * opacity + backdrop[index] * (1 - opacity))
  const [light, dark] = [luminance(blended), luminance(backdrop)].sort((a, b) => b - a)
  return (light + .05) / (dark + .05)
}

for (const palette of ['blue-yellow', 'red-black']) {
  const tokens = { ...declarations(globals, ':root'), ...(palette === 'red-black' ? declarations(globals, "[data-palette='red-black']") : {}) }
  const resolve = value => value.replace(/var\((--[\w-]+)\)/g, (_, name) => tokens[name])
  test(`${palette}: click instructions stay readable at the dimmest animation frame and on hover`, () => {
    const animation = entry.match(/@keyframes world-entry-beckon\s*\{([^\n]+)/)?.[1]
    assert.ok(animation, 'the invitation cue has its expected animation')
    const opacity = Math.min(...Array.from(animation.matchAll(/opacity\s*:\s*([\d.]+)/g), match => Number(match[1])))
    assert.ok(Number.isFinite(opacity), 'animation opacity can be evaluated')
    for (const [foreground, background] of [
      [tokens['--scene-paper'], tokens['--scene-bg']],
      [tokens['--scene-on-paper'], tokens['--scene-paper']],
    ]) {
      const ratio = contrast(foreground, background, opacity)
      assert.ok(ratio >= 4.5, `dimmest cue contrast is ${ratio.toFixed(2)}:1 at opacity ${opacity}`)
    }
  })
  test(`${palette}: the small PIXEL WORLD eyebrow meets 4.5:1 contrast`, () => {
    const foreground = resolve(declarations(invitation, '.street-world__index').color)
    const ratio = contrast(foreground, tokens['--scene-bg'])
    assert.ok(ratio >= 4.5, `${foreground} on ${tokens['--scene-bg']} is ${ratio.toFixed(2)}:1`)
  })
}
