export type PixelLocale = 'ja' | 'en'
export type PixelPalette = 'blue-yellow' | 'red-black'
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Point = { x: number; y: number }
export type Rect = Point & { w: number; h: number }
export type Localized = Record<PixelLocale, string>
export type WorldSpot = Point & {
  id: string
  kind: 'npc' | 'pond' | 'board' | 'mailbox'
  name: Localized
  title: Localized
  lines: Record<PixelLocale, string[]>
  workSlug?: string
  sprite?: 'ginger' | 'cream' | 'calico'
  radius: number
}
export type WorldMap = {
  width: number
  height: number
  spawn: Point
  bounds: Rect
  obstacles: Rect[]
  spots: WorldSpot[]
}
export type WorldInput = Point
export type WorldState = {
  player: Point & { vx: number; vy: number; facing: Direction; moving: boolean; step: number }
  time: number
  paused: boolean
  nearbyId: string | null
  activeId: string | null
  discovered: string[]
  fishing: 'idle' | 'waiting' | 'bite' | 'caught'
  fishingTimer: number
  notice: 'early' | 'missed' | 'caught' | null
  path: Point[]
}
export type PixelSnapshot = Omit<WorldState, 'path'> & { destination: Point | null }
