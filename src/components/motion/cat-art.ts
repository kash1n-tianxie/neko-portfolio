import type { Palette } from '../palette-preference'

type Eye = { x: number; y: number; travelX: number; travelY: number; clip: string }
type CatArt = { src: string; iris: string; eyes: readonly Eye[] }

// Measured from normalized 1024-square artwork; clip paths stay inside the ivory whites.
export const catArt: Record<Palette, CatArt> = {
  'blue-yellow': {
    src: '/assets/cat/cat-blue-yellow.webp', iris: '#cfac3f',
    eyes: [
      { x: 407, y: 367, travelX: 11, travelY: 8, clip: 'M366 325 C400 321 438 347 452 390 C433 410 407 415 384 394 C365 377 359 347 366 325Z' },
      { x: 604, y: 367, travelX: 11, travelY: 8, clip: 'M646 325 C614 319 574 346 556 390 C573 410 601 416 625 393 C643 375 654 345 646 325Z' },
    ],
  },
  'red-black': {
    src: '/assets/cat/cat-red-black.webp', iris: '#b6b3ad',
    eyes: [
      { x: 407, y: 367, travelX: 11, travelY: 8, clip: 'M366 325 C400 321 439 347 453 390 C433 410 407 415 384 394 C365 377 359 347 366 325Z' },
      { x: 604.5, y: 367.5, travelX: 11, travelY: 8, clip: 'M647 325 C615 319 575 346 557 390 C574 410 602 416 626 393 C644 375 655 345 647 325Z' },
    ],
  },
}

/** Normalized elliptical travel, independent of artwork or rendered screen size. */
export function gazeVector(dx: number, dy: number) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return { x: 0, y: 0 }
  const distance = Math.hypot(dx, dy)
  if (!distance) return { x: 0, y: 0 }
  const divisor = Math.max(240, distance)
  return { x: dx / divisor, y: dy / divisor }
}
