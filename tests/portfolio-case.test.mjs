import assert from 'node:assert/strict'
import test from 'node:test'
import { componentLoader, renderComponent } from './helpers/render-components.mjs'

const anchors = ['kashin-ink', 'nyanko-home', 'meme-clash', 'park-master', 'please-sit', '2048', 'tamago-exe']
const stripTags = (html) => html.replace(/<[^>]*>/g, '')

for (const locale of ['ja', 'en']) {
  test(`${locale}: homepage features and navigation preserve anchors with portfolio first and archive at 08`, async () => {
    const load = componentLoader(locale)
    const { Works } = load('src/components/sections/works.tsx')
    const html = await renderComponent(Works)
    const articleIds = [...html.matchAll(/<article\b[^>]*\bid="featured-([^"]+)"/g)].map((match) => match[1])
    assert.deepEqual(articleIds, anchors)
    const nav = html.match(/<nav class="street-works__select"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? ''
    assert.deepEqual([...nav.matchAll(/href="#featured-([^"]+)"/g)].map((match) => match[1]), anchors)
    const articles = [...html.matchAll(/<article\b[^>]*\bid="featured-[^"]+"[^>]*>([\s\S]*?)<\/article>/g)]
    articles.forEach((article, index) => assert.match(stripTags(article[1]), new RegExp(`^0${index + 1}\\s*/`)))
    assert.match(html, /SELECTED WORKS — 07/)
    assert.match(html, /class="project-card__number"[^>]*>08<\/span>/)
    assert.equal((html.match(/id="featured-kashin-ink"/g) ?? []).length, 1)
    const first = articles[0][1]
    assert.match(first, /KASHIN\.INK/)
    assert.ok(first.includes(`href="${locale === 'en' ? '/en' : ''}/works/kashin-ink"`))
    assert.ok(first.match(/<a\b[^>]*href="\/(?:en\/)?world"[^>]*>/)?.[0].includes('data-canvas-transition="true"'), 'feature world link uses the scene transition')
    assert.match(first, /cover\.webp/)
    assert.doesNotMatch(first, /cover\.gif/)
  })

  test(`${locale}: Hero strip starts with the portfolio and still targets every existing feature`, async () => {
    const { Hero } = componentLoader(locale)('src/components/sections/hero.tsx')
    const html = await renderComponent(Hero)
    const strip = html.match(/<div class="manga-latest">([\s\S]*?)<\/div>/)?.[1] ?? ''
    assert.deepEqual([...strip.matchAll(/href="#featured-([^"]+)"/g)].map((match) => match[1]), anchors)
    assert.match(stripTags(strip), /01KASHIN\.INK/)
  })

  test(`${locale}: portfolio detail has four custom sections, accessible source/home/world links and a static SSR cover`, async () => {
    const route = componentLoader(locale)('src/app/[locale]/works/[slug]/page.tsx')
    assert.ok(route.generateStaticParams().some((params) => params.locale === locale && params.slug === 'kashin-ink'), 'portfolio route must be generated')
    const html = await renderComponent(route.default, { params: Promise.resolve({ locale, slug: 'kashin-ink' }) })
    assert.match(html, /<h1[^>]*>KASHIN\.INK<\/h1>/)
    assert.equal((html.match(/class="case-section"/g) ?? []).length, 4)
    const headings = [...html.matchAll(/<section class="case-section">[\s\S]*?<h2[^>]*>(.*?)<\/h2>/g)].map((match) => stripTags(match[1]))
    assert.equal(headings[0], locale === 'ja' ? '作品一覧を、体験の入口に' : 'From a project list to an experience')
    assert.ok(html.includes('href="https://github.com/kash1n-tianxie/neko-portfolio"'))
    assert.match(html, /href="https:\/\/kashin\.ink\/"[^>]*>[\s\S]*?(?:サイトのトップへ|Visit the homepage)/)
    assert.ok(html.includes(`href="${locale === 'en' ? '/en' : ''}/world"`))
    assert.ok(html.match(/<a\b[^>]*href="\/(?:en\/)?world"[^>]*>/)?.[0].includes('data-canvas-transition="true"'), 'detail world link uses the scene transition')
    assert.match(html, locale === 'ja' ? /ピクセルの街を歩く/ : /Walk the pixel town/)
    const cover = html.match(/<div class="case-cover">([\s\S]*?)<\/div>/)?.[1] ?? ''
    assert.match(cover, /cover\.webp/)
    assert.doesNotMatch(cover, /cover\.gif/)
    assert.match(cover, /width="1280" height="800"/)
    assert.match(html, /AI/)
  })
}

test('Nyanko Home keeps its standalone 01 default when no parent index is supplied', async () => {
  const { NyankoHomeFeature } = componentLoader('ja')('src/components/works/nyanko-home-feature.tsx')
  const html = await renderComponent(NyankoHomeFeature, { locale: 'ja' })
  assert.match(stripTags(html), /01\/ FEATURED GAME/)
})
