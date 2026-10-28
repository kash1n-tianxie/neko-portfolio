import type { Point } from './world-types'

export function fitPixelViewport(cssWidth: number, cssHeight: number) {
  const width = Math.max(1, Number.isFinite(cssWidth) ? cssWidth : 640)
  const height = Math.max(1, Number.isFinite(cssHeight) ? cssHeight : 480)
  const scale = width < 700 ? 2 : width >= 1700 ? 4 : 3
  return { scale, width: Math.ceil(width / scale), height: Math.ceil(height / scale) }
}

export function pixelCamera(player: Point, width: number, height: number, mapWidth: number, mapHeight: number): Point {
  return {
    x: Math.round(Math.max(0, Math.min(mapWidth - width, player.x - width / 2))),
    y: Math.round(Math.max(0, Math.min(mapHeight - height, player.y - height / 2))),
  }
}
