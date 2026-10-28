import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

// Execute the actual persistence boundary without importing the browser-only UI.
const path = new URL('../src/components/world/pixel-world.tsx', import.meta.url)
const source = existsSync(path) ? readFileSync(path, 'utf8') : ''
const file = ts.createSourceFile('pixel-world.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const helpers = file.statements.filter(node => ts.isFunctionDeclaration(node) &&
  ['validateDiscoveries', 'readDiscoveries', 'saveDiscoveries'].includes(node.name?.text))
const javascript = ts.transpileModule(helpers.map(node => node.getText(file)).join('\n'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const exports = {}
vm.runInNewContext(javascript, { exports })

test('stored discoveries reject malformed data and unknown town entries', () => {
  assert.equal(typeof exports.validateDiscoveries, 'function', 'persistence validation exists')
  for (const invalid of [null, '[]', {}, 4]) {
    assert.deepEqual(Array.from(exports.validateDiscoveries(invalid, ['guide', 'pond'])), [])
  }
  assert.deepEqual(Array.from(exports.validateDiscoveries(['guide', 'invented', 4, 'pond', 'guide'], ['guide', 'pond'])), ['guide', 'pond'])
})

test('unreadable or corrupt browser storage cannot stop town startup', () => {
  assert.equal(typeof exports.readDiscoveries, 'function')
  assert.deepEqual(Array.from(exports.readDiscoveries(() => { throw Error('blocked') }, ['guide'])), [])
  assert.deepEqual(Array.from(exports.readDiscoveries(() => '{', ['guide'])), [])
  assert.deepEqual(Array.from(exports.readDiscoveries(() => '["guide","other"]', ['guide'])), ['guide'])
})

test('discoveries use the versioned key and blocked saves remain nonfatal', () => {
  assert.equal(typeof exports.saveDiscoveries, 'function')
  const writes = []
  exports.saveDiscoveries((...args) => writes.push(args), ['guide'])
  assert.equal(writes[0][0], 'neko-pixel-discoveries-v1')
  assert.deepEqual(JSON.parse(writes[0][1]), ['guide'])
  assert.doesNotThrow(() => exports.saveDiscoveries(() => { throw Error('blocked') }, ['guide']))
})
