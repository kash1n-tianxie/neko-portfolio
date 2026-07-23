/**
 * One-shot asset pipeline for AI-generated art:
 *  - cats: the generator bakes a fake transparency checkerboard into the
 *    pixels, so we flood-fill from the borders to key out neutral-light
 *    background (interior whites like the eyes survive), feather the edge,
 *    resize to 1024 and emit real-alpha PNGs.
 *  - ink-hero: PNG bytes shipped with a .webp name -> encode a real WebP.
 *  - og-bg: resize to the OG card size (1200x630).
 *
 * Usage: node scripts/process-assets.mjs
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const PUB = 'public/assets'
const SRC = 'assets-src' // originals are parked here, outside /public

const isLight = (r, g, b) =>
  r > 178 && g > 178 && b > 178 && Math.max(r, g, b) - Math.min(r, g, b) < 26

async function keyCat(inPath, outPath, maxSize = 1024) {
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels: c } = info
  const removed = new Uint8Array(w * h)
  const queue = []
  const idx = (x, y) => y * w + x

  const trySeed = (i) => {
    if (removed[i]) return
    if (isLight(data[i * c], data[i * c + 1], data[i * c + 2])) {
      removed[i] = 1
      queue.push(i)
    }
  }
  for (let x = 0; x < w; x++) {
    trySeed(idx(x, 0))
    trySeed(idx(x, h - 1))
  }
  for (let y = 0; y < h; y++) {
    trySeed(idx(0, y))
    trySeed(idx(w - 1, y))
  }
  while (queue.length) {
    const i = queue.pop()
    const x = i % w
    const y = (i / w) | 0
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      trySeed(idx(nx, ny))
    }
  }

  // ---- second pass: enclosed checkerboard pockets (e.g. between the legs) ----
  // The checkerboard is exactly two light tones in roughly equal halves; solid
  // whites like the eyes are one tone, so they survive this test.
  const lumOf = (i) => data[i * c] * 0.299 + data[i * c + 1] * 0.587 + data[i * c + 2] * 0.114
  const hist = new Uint32Array(256)
  for (let i = 0; i < w * h; i++) if (removed[i]) hist[Math.round(lumOf(i))]++
  let t1 = 255
  let best = 0
  for (let l = 0; l < 256; l++) if (hist[l] > best) { best = hist[l]; t1 = l }
  let t2 = t1
  best = 0
  for (let l = 0; l < 256; l++) {
    if (Math.abs(l - t1) <= 6) continue
    if (hist[l] > best) { best = hist[l]; t2 = l }
  }

  const seen = new Uint8Array(w * h)
  for (let s = 0; s < w * h; s++) {
    if (seen[s] || removed[s]) continue
    if (!isLight(data[s * c], data[s * c + 1], data[s * c + 2])) continue
    // collect this enclosed light component
    const comp = [s]
    seen[s] = 1
    let n1 = 0
    let n2 = 0
    for (let k = 0; k < comp.length; k++) {
      const i = comp[k]
      const lum = lumOf(i)
      if (Math.abs(lum - t1) <= 6) n1++
      else if (Math.abs(lum - t2) <= 6) n2++
      const x = i % w
      const y = (i / w) | 0
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
        const ni = idx(nx, ny)
        if (seen[ni] || removed[ni]) continue
        if (!isLight(data[ni * c], data[ni * c + 1], data[ni * c + 2])) continue
        seen[ni] = 1
        comp.push(ni)
      }
    }
    const size = comp.length
    const both = Math.min(n1, n2) / size
    const matched = (n1 + n2) / size
    // checker pocket: both tones clearly present and cover most of the area
    if (size >= 120 && both >= 0.12 && matched >= 0.6) {
      for (const i of comp) removed[i] = 1
    }
  }

  const out = Buffer.from(data)
  let cut = 0
  for (let i = 0; i < w * h; i++) {
    if (removed[i]) {
      out[i * c + 3] = 0
      cut++
      continue
    }
    // feather pixels that touch the removed region so edges don't halo
    const x = i % w
    const y = (i / w) | 0
    let adj = false
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      if (removed[idx(nx, ny)]) {
        adj = true
        break
      }
    }
    if (adj) {
      const lum = out[i * c] * 0.299 + out[i * c + 1] * 0.587 + out[i * c + 2] * 0.114
      const a = Math.max(0, Math.min(255, Math.round(((230 - lum) * 255) / 95)))
      out[i * c + 3] = Math.min(out[i * c + 3], a)
    }
  }

  const pipeline = sharp(out, { raw: { width: w, height: h, channels: c } })
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true })
  if (outPath.endsWith('.webp')) pipeline.webp({ quality: 85, alphaQuality: 90 })
  else pipeline.png({ compressionLevel: 9 })
  await pipeline.toFile(outPath)
  console.log(`${path.basename(outPath)}: keyed ${Math.round((cut / (w * h)) * 100)}% of pixels as background`)
}

fs.mkdirSync(SRC, { recursive: true })
fs.mkdirSync(`${PUB}/paint`, { recursive: true })

// transparent-keyed cats; entries not present yet are skipped silently
const cats = [
  ['cat-sleep', `${PUB}/cat`, 1024, 'png'],
  ['cat-sit', `${PUB}/cat`, 1024, 'png'],
  ['cat-lost', `${PUB}/cat`, 1024, 'png'],
  ['cat-awake', `${PUB}/cat`, 1024, 'png'],
  ['cat-leap', `${PUB}/paint`, 1600, 'webp'],
]
for (const [name, dir, size, fmt] of cats) {
  const src = `${SRC}/${name}.png`
  const pub = `${dir}/${name}.${fmt}`
  if (!fs.existsSync(src) && !fs.existsSync(`${dir}/${name}.png`)) continue
  if (!fs.existsSync(src)) fs.renameSync(`${dir}/${name}.png`, src)
  await keyCat(src, pub, size)
}

{
  const src = `${SRC}/ink-hero.png`
  const legacy = `${PUB}/ink/ink-hero-src.png`
  if (!fs.existsSync(src) && fs.existsSync(legacy)) fs.renameSync(legacy, src)
  if (fs.existsSync(src)) {
    await sharp(src).webp({ quality: 80 }).toFile(`${PUB}/ink/ink-hero.webp`)
    console.log('ink-hero.webp: encoded real WebP')
  }
}

{
  const src = `${SRC}/og-bg.png`
  const legacy = `${PUB}/og/og-bg-src.png`
  if (!fs.existsSync(src) && fs.existsSync(legacy)) fs.renameSync(legacy, src)
  if (fs.existsSync(src)) {
    await sharp(src).resize(1200, 630, { fit: 'cover' }).png({ compressionLevel: 9 }).toFile(`${PUB}/og/og-bg.png`)
    console.log('og-bg.png: resized to 1200x630')
  }
}
