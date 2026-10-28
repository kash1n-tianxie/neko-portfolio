import type { Direction, PixelLocale, PixelPalette, Point, WorldMap, WorldSpot, WorldState } from './world-types'
import { catSprite, CAT_COLORS, type CatCoat } from './cat-sprites'

/** Every moving frame is an intentional pixel drawing, not a scaled body rig. */
export function drawPixelCat(ctx: CanvasRenderingContext2D, x: number, y: number, coat: CatCoat, facing: Direction, step: number, moving: boolean, accent: string) {
  const rows = catSprite(facing, step, moving)
  const colors: Record<string, string> = { ...CAT_COLORS[coat], r: accent }
  const left = Math.round(x) - 14, top = Math.round(y) - 21
  ctx.fillStyle = '#263c314b'; ctx.fillRect(Math.round(x) - 10, Math.round(y), 20, 2)
  for (let py = 0; py < rows.length; py++) for (let px = 0; px < rows[py].length; px++) {
    const value = rows[py][px]
    if (value === '.') continue
    let color = colors[value]
    if (coat === 'calico' && (value === 'b' || value === 'h') && py < 12 && px < 11) color = '#bd703a'
    ctx.fillStyle = color
    ctx.fillRect(left + px, top + py, 1, 1)
  }
}

function pixelLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, accent = '#f5d381') {
  ctx.font = 'bold 7px monospace'
  const w = Math.ceil(ctx.measureText(text).width) + 8
  ctx.fillStyle = '#20342fe8'; ctx.fillRect(Math.round(x - w / 2), Math.round(y - 8), w, 12)
  ctx.fillStyle = accent; ctx.fillText(text, Math.round(x - w / 2 + 4), Math.round(y))
}

export function renderPixelWorld(ctx: CanvasRenderingContext2D, image: HTMLImageElement, state: WorldState, map: WorldMap, camera: Point, palette: PixelPalette, locale: PixelLocale, reducedMotion: boolean) {
  const width = ctx.canvas.width, height = ctx.canvas.height
  const accent = palette === 'red-black' ? '#982c28' : '#305a91'
  const time = reducedMotion ? 0 : state.time
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = '#1f493e'; ctx.fillRect(0, 0, width, height)
  ctx.save(); ctx.translate(-Math.round(camera.x), -Math.round(camera.y))
  ctx.drawImage(image, 0, 0, map.width, map.height)

  // Tiny water glints and butterflies keep the town alive without moving the ground.
  ctx.fillStyle = '#bde4d488'
  for (let i = 0; i < 14; i++) {
    const x = 552 + (i * 41 % 153), y = 273 + (i * 53 % 143)
    const pulse = Math.sin(time * 1.3 + i) > .35
    if (pulse) { ctx.fillRect(x, y, 4 + i % 4, 1); ctx.fillRect(x + 2, y - 1, 2, 1) }
  }
  for (const [i, p] of [{ x: 335, y: 291 }, { x: 287, y: 188 }, { x: 465, y: 220 }].entries()) {
    const x = Math.round(p.x + Math.sin(time * .7 + i) * 8), y = Math.round(p.y + Math.cos(time * .6 + i) * 5)
    ctx.fillStyle = '#f8e5a9'; ctx.fillRect(x - 2, y, 2, 2); ctx.fillRect(x + 1, y + (Math.floor(time * 8) % 2), 2, 2)
    ctx.fillStyle = '#60563f'; ctx.fillRect(x, y, 1, 3)
  }
  const destination = state.path.at(-1)
  if (destination) {
    ctx.fillStyle = '#fff6c7'
    const x = Math.round(destination.x), y = Math.round(destination.y)
    ctx.fillRect(x - 5, y - 1, 11, 2); ctx.fillRect(x - 1, y - 5, 2, 11)
  }

  const actors: Array<Point & { npc?: WorldSpot }> = map.spots.filter(s => s.kind === 'npc').map(s => ({ x: s.x, y: s.y, npc: s }))
  actors.push({ x: state.player.x, y: state.player.y })
  actors.sort((a, b) => a.y - b.y)
  for (const actor of actors) {
    if (actor.npc) drawPixelCat(ctx, actor.x, actor.y, actor.npc.sprite ?? 'cream', 'down', 0, false, actor.npc.id === 'maker' ? '#91b6d3' : '#b8674a')
    else drawPixelCat(ctx, actor.x, actor.y, 'ginger', state.player.facing, state.player.step, state.player.moving, accent)
  }
  for (const spot of map.spots) {
    const seen = state.discovered.includes(spot.id), near = state.nearbyId === spot.id
    if (near && !state.activeId) pixelLabel(ctx, spot.kind === 'pond' ? (locale === 'ja' ? 'FISH  [E]' : 'FISH  [E]') : 'TALK  [E]', spot.x, spot.y - 32, '#fff9dd')
    else {
      const y = Math.round(spot.y - (spot.kind === 'npc' ? 29 : 12) + (reducedMotion ? 0 : Math.sin(time * 2 + spot.x) * 1))
      ctx.fillStyle = '#29463d'; ctx.fillRect(spot.x - 3, y - 3, 7, 7)
      ctx.fillStyle = seen ? '#b6dda0' : '#ffe8a8'
      if (seen) { ctx.fillRect(spot.x - 1, y, 2, 2); ctx.fillRect(spot.x + 1, y - 2, 2, 3) }
      else { ctx.fillRect(spot.x, y - 2, 1, 3); ctx.fillRect(spot.x, y + 2, 1, 1) }
    }
  }
  if (state.fishing === 'waiting' || state.fishing === 'bite') {
    const bob = { x: 533, y: 319 }
    ctx.strokeStyle = '#e4ce9b'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(state.player.x + 4, state.player.y - 9); ctx.lineTo(bob.x, bob.y); ctx.stroke()
    ctx.fillStyle = '#fff3bf'; ctx.fillRect(bob.x - 3, bob.y + 3, 8, 1)
    ctx.fillStyle = '#e66a4c'; ctx.fillRect(bob.x, bob.y - (state.fishing === 'bite' ? 2 : 0), 2, 3)
    if (state.fishing === 'bite') pixelLabel(ctx, '!', bob.x, bob.y - 10, '#fff4a7')
  }
  ctx.restore()

  // Small, stable location aid; UI/help provide the actual names.
  const miniWidth = width < 260 ? 60 : 92, miniHeight = Math.round(miniWidth * 2 / 3)
  const mx = width - miniWidth - 8, my = width < 260 ? 43 : 30
  ctx.fillStyle = '#182d2be8'; ctx.fillRect(mx - 3, my - 3, miniWidth + 6, miniHeight + 6)
  ctx.drawImage(image, mx, my, miniWidth, miniHeight)
  for (const spot of map.spots) {
    ctx.fillStyle = state.discovered.includes(spot.id) ? '#b2d894' : '#ffdc75'
    ctx.fillRect(Math.floor(mx + spot.x / map.width * miniWidth), Math.floor(my + spot.y / map.height * miniHeight), 2, 2)
  }
  ctx.fillStyle = '#162a35'; const px = Math.floor(mx + state.player.x / map.width * miniWidth), py = Math.floor(my + state.player.y / map.height * miniHeight)
  ctx.fillRect(px - 2, py - 2, 5, 5); ctx.fillStyle = '#fff9eb'; ctx.fillRect(px - 1, py - 1, 3, 3)
}
