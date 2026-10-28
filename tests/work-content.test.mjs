import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import test from 'node:test'
import ts from 'typescript'

// Load the real content modules with their TypeScript types erased, not mocked.
function contentUrl(path) {
  const output = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace(/from ['"](.+?)['"]/g, (statement, specifier) => {
    if (!specifier.startsWith('.')) return statement
    return `from '${contentUrl(resolve(dirname(path), `${specifier}.ts`))}'`
  })
  return `data:text/javascript;base64,${Buffer.from(output).toString('base64')}`
}

const { works, featuredWorkSlugs } = await import(contentUrl(resolve('src/content/works.ts')))
const selected = ['nyanko-home', 'meme-clash', 'park-master', 'please-take-a-seat', 'hyakki-lantern', 'tamago-exe']

test('six current featured works exist once in live-site order', () => {
  assert.deepEqual(works.slice(0, 6).map(({ slug }) => slug), selected)
  assert.deepEqual(featuredWorkSlugs, selected)
  assert.equal(new Set(works.map(({ slug }) => slug)).size, works.length)
  assert.ok(works.length > 6, 'existing smaller projects remain')
})

test('every project cover and gallery image exists locally', () => {
  for (const work of works) {
    for (const asset of [work.thumbnail, work.coverGif, ...work.gallery?.map(({ src }) => src) ?? []].filter(Boolean)) {
      assert.ok(existsSync(resolve(`public${asset}`)), `${work.slug}: missing ${asset}`)
    }
  }
})

test('current play links and release labels remain aligned with published projects', () => {
  const bySlug = Object.fromEntries(works.map((work) => [work.slug, work]))
  assert.equal(bySlug['nyanko-home']?.links?.itch, 'https://kashin-ou.itch.io/cats-and-dried-fish')
  assert.equal(bySlug['meme-clash']?.links?.itch, 'https://kashin-ou.itch.io/meme-clash')
  assert.equal(bySlug['park-master']?.links?.demo, 'https://park.kashin.ink/')
  assert.match(bySlug['nyanko-home']?.releaseLabel?.en ?? '', /0\.4\.0/)
  assert.match(bySlug['meme-clash']?.releaseLabel?.en ?? '', /0\.39\.0/)
  assert.match(bySlug['please-take-a-seat']?.releaseLabel?.en ?? '', /1\.2\.0/)
})

test('new featured covers are genuine animated GIFs with static fallbacks', () => {
  for (const slug of selected.slice(0, 3)) {
    const work = works.find((item) => item.slug === slug)
    assert.ok(work?.coverGif?.endsWith('.gif'), `${slug}: needs an actual GIF cover`)
    const bytes = readFileSync(resolve(`public${work.coverGif}`))
    assert.match(bytes.subarray(0, 6).toString(), /^GIF8[79]a$/)
    assert.notEqual(work.coverGif, work.thumbnail)
    assert.ok(bytes.length < 6_000_000, `${slug}: keep cover lightweight`)
  }
})

test('direct animated detail images fill a fixed cover box without recoloring', () => {
  const css = readFileSync(resolve('src/app/globals.css'), 'utf8')
  const directImage = css.match(/\.case-cover\s*>\s*img\s*\{([^}]*)\}/)?.[1] ?? ''
  for (const declaration of ['position: absolute', 'inset: 0', 'width: 100%', 'height: 100%', 'object-fit: contain']) {
    assert.ok(directImage.includes(declaration), `direct cover image needs ${declaration}`)
  }
  assert.doesNotMatch(directImage, /filter\s*:/)
})
