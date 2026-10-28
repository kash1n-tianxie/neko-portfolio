import test from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { catArt } from '../src/components/motion/cat-art.ts'

for (const [palette, art] of Object.entries(catArt)) {
  test(`${palette} cat has real alpha and its moving eye centers stay in the generated whites`, async () => {
    const file = new URL(`../public${art.src}`, import.meta.url)
    const { data, info } = await sharp(file.pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    assert.equal(info.width, 1024)
    assert.equal(info.height, 1024)
    const rgba = (x, y) => [...data.subarray((Math.round(y) * info.width + Math.round(x)) * 4, (Math.round(y) * info.width + Math.round(x)) * 4 + 4)]
    for (const [x, y] of [[0, 0], [1023, 0], [0, 1023], [1023, 1023]]) assert.equal(rgba(x, y)[3], 0)
    for (const eye of art.eyes) {
      for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [Math.SQRT1_2, Math.SQRT1_2], [-Math.SQRT1_2, -Math.SQRT1_2]]) {
        const pixel = rgba(eye.x + dx * eye.travelX, eye.y + dy * eye.travelY)
        assert.ok(pixel[3] >= 250, `${palette} eye interior must be opaque`)
        assert.ok(pixel.slice(0, 3).every(channel => channel >= 180), `${palette} pupil center must remain in pale eye art`)
      }
    }
  })
}

for (const name of ['spray-hero', 'spray-menu']) {
  test(`${name} is a reusable alpha texture, not a background rectangle`, async () => {
    const file = new URL(`../public/assets/ink/${name}.webp`, import.meta.url)
    const metadata = await sharp(file.pathname).metadata()
    assert.equal(metadata.hasAlpha, true)
    const data = await sharp(file.pathname).extractChannel('alpha').raw().toBuffer()
    const opaque = data.filter(value => value >= 250).length / data.length
    const clear = data.filter(value => value === 0).length / data.length
    assert.ok(opaque > .05, 'paint needs a dense readable center')
    assert.ok(clear > .05, 'paint needs genuine transparent negative space')
    assert.ok(opaque < .85, 'paint must not fill an opaque rectangle')
  })
}
