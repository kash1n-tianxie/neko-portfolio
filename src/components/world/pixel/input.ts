import type { Point } from './world-types'

export function readMovement(keys: ReadonlySet<string>, touch: Point): Point {
  return {
    x: Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft')) + touch.x,
    y: Number(keys.has('KeyS') || keys.has('ArrowDown')) - Number(keys.has('KeyW') || keys.has('ArrowUp')) + touch.y,
  }
}
export function acceptsGameKeys(tagName: string, editable: boolean) {
  return !editable && (tagName === 'CANVAS' || tagName === 'BODY')
}
