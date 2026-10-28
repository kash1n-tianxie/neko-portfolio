import type { Direction } from './world-types'

export type CatCoat = 'black' | 'cream' | 'ginger' | 'calico'
export const CAT_COLORS = {
  ginger: { O: '#292b26', b: '#eeb04f', h: '#f5bf64', s: '#df833d', w: '#fff5e6', r: '#982c28', e: '#282b25', n: '#d98371' },
  cream: { O: '#534936', b: '#eee0bd', h: '#fff0ce', s: '#c8ac80', w: '#fff9ed', r: '#728c69', e: '#353b30', n: '#cc8d7e' },
  calico: { O: '#39352e', b: '#f4e3bd', h: '#fff1d5', s: '#bd703a', w: '#fff8ec', r: '#638caa', e: '#30322b', n: '#d58f7a' },
  black: { O: '#242b2c', b: '#454c4b', h: '#626a63', s: '#333a3a', w: '#fff1d8', r: '#b4503b', e: '#151e1d', n: '#c58c7d' },
} as const

// Hand-pixelled from the user's silhouette reference: oversized soft head, cream
// muzzle, low horizontal body, four tiny paws, and an upright curved tail.
const SIDE = [
  '', '', '', '', '',
  '...OO.......OO',
  '...ObO.....ObO',
  '...ObbOOOOObbO',
  '..ObbbbsssbbbbO',
  '..ObhhhhhhhhhbbO......OO',
  '.ObhhhhhhhhhhbbO......ObO',
  '.ObbeebbbeebbbbO......OsO',
  '.ObbeebbbeebbbbO.....ObsO',
  '..ObwwwwwwwbbbbO....ObbsO',
  '...OwwwwwwwwbbbOOOOOObsO',
  '...ObrrrrrrrrrrObbbbbsO',
  '...ObbbbbbbbbbbbbbsOO',
  '...ObbhhhhhhhhhbbbsO',
  '...ObbbbbbbbbbbbbbsO',
  '...ObbbbbbbbbbbbbbsO',
  '...OOwO.OOOO.OwOwOO',
  '...OOOO......OOOOOO',
  '', '',
]
const FRONT = [
  '', '', '', '',
  '......OO........OO',
  '......ObO......ObO',
  '......ObbOOOOOObbO',
  '.....ObbbbssssbbbbO',
  '.....ObhhhhhhhhhhbO',
  '....ObhhhhhhhhhhhhbO',
  '....ObbeehhhheebbbbO',
  '....ObbeehhhheebbbOO...OO',
  '.....ObbwwwwwwwbbO....ObO',
  '......ObwwnwwwwbO.....OsO',
  '.......OwwwwwwwO.....ObsO',
  '.......OrrrrrrrO....ObsO',
  '......ObbbbbbbbbOOOObsO',
  '......ObbhhwhhbbbbsOO',
  '......ObbhhhhhhbbbO',
  '......ObbbbbbbbbbbO',
  '......OOwOO..OOwOO',
  '......OOOO....OOOO',
  '', '',
]
const BACK = [
  '', '', '', '',
  '......OO........OO',
  '......ObO......ObO',
  '......ObbOOOOOObbO',
  '.....ObbbbssssbbbbO',
  '.....ObhhhhhhhhhhbO',
  '....ObhhhhhhhhhhhhbO',
  '....ObhhhhhhhhhhhhbO',
  '....ObbhhhhhhhhhhbbO',
  '.....ObbhhhhhhhhbbO',
  '......ObbbbbbbbbbO',
  '.......OrrrrrrrrO',
  '......ObbbbbbbbbbO',
  '......ObbhhhhhhbbO....OsO',
  '......ObbhhhhhhbbOOOOObsO',
  '......ObbbbbbbbbbbbbbssO',
  '......ObbbbbbbbbbbOOOOO',
  '......OOwOO..OOwOO',
  '......OOOO....OOOO',
  '', '',
]

/** Stable 28×24 canvas and y=21 foot line keep all directions from jumping. */
export function catSprite(facing: Direction, step: number, moving: boolean): string[] {
  const source = facing === 'down' ? FRONT : facing === 'up' ? BACK : SIDE
  const rows = source.map(row => row.padEnd(28, '.').split(''))
  const phase = moving && Number.isFinite(step) ? Math.floor(step) % 4 : 0
  if (moving) {
    const leftFoot = facing === 'up' || facing === 'down' ? 6 : 3
    const rightFoot = facing === 'up' || facing === 'down' ? 14 : 15
    const lifted = phase === 1 ? leftFoot : phase === 3 ? rightFoot : -1
    if (lifted >= 0) {
      for (let x = lifted; x < lifted + 4; x++) { rows[20][x] = rows[21][x]; rows[21][x] = '.' }
    }
    if (phase === 2) { // The opposite diagonal pair passes underneath the belly.
      rows[20][leftFoot + 3] = '.'; rows[21][leftFoot + 3] = '.'
      rows[20][rightFoot - 1] = 'O'; rows[21][rightFoot - 1] = 'O'
    }
  }
  return rows.map(row => (facing === 'right' ? row.reverse() : row).join(''))
}
