import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const componentPath = new URL('../src/components/sections/world-entry.tsx', import.meta.url)
const source = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText
const exports = {}
vm.runInNewContext(javascript, { exports, require })

// Removing either artwork placement or localizing the cue with the wrong branch
// must fail these consumer-visible rendering contracts.
for (const [ja, compact, cue] of [
  [true, true, 'クリックして冒険する'],
  [false, true, 'CLICK TO EXPLORE'],
  [true, false, 'クリックして冒険する'],
  [false, false, 'CLICK TO EXPLORE'],
]) {
  test(`${ja ? 'Japanese' : 'English'} ${compact ? 'hero preview' : 'town invitation'} renders the illustrated entrance and readable action`, () => {
    assert.equal(typeof exports.WorldEntryContent, 'function', 'shared illustrated entrance exists')
    const markup = renderToStaticMarkup(React.createElement(exports.WorldEntryContent, { ja, compact }))
    assert.match(markup, /<img\b[^>]*src="\/assets\/world\/pixel-world-invitation\.webp"/)
    assert.match(markup, /width="768"/)
    assert.match(markup, /height="512"/)
    assert.ok(markup.includes(cue), 'the click instruction remains real, localized HTML text')
    assert.ok(markup.includes('PIXEL WORLD'), 'visitors can identify the destination')
    assert.doesNotMatch(markup, /<button|<a\b/, 'content must not nest controls inside the enclosing entrance link')
    if (compact) assert.doesNotMatch(markup, /<h[1-6]\b/)
    else assert.match(markup, /<h2\b[^>]*id="world-invitation-title"[^>]*>NEKO <span>TOWN<\/span><\/h2>/)
  })
}
