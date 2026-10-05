export type WorldDestinationId = 'entry' | '2048' | 'tamago-exe' | 'pond' | 'workshop' | 'lookout'

export type WorldDestination = {
  id: WorldDestinationId
  labelKey: string
  x: number
  z: number
  heading: number
  landmark?: { x: number; z: number }
}

/** Grounded, obstruction-free arrival points; the map and engine share these coordinates. */
export const WORLD_DESTINATIONS: WorldDestination[] = [
  { id: 'entry', labelKey: 'destinationEntry', x: 0, z: 27, heading: Math.PI / 2 },
  { id: '2048', labelKey: 'destination2048', x: -5, z: 10.8, heading: Math.PI / 2, landmark: { x: -5, z: 8 } },
  { id: 'tamago-exe', labelKey: 'destinationTamago', x: 5, z: 10.8, heading: Math.PI / 2, landmark: { x: 5, z: 8 } },
  { id: 'pond', labelKey: 'destinationPond', x: -12, z: 22, heading: Math.PI / 2 },
  { id: 'workshop', labelKey: 'destinationWorkshop', x: 11.6, z: 18.2, heading: Math.PI / 2 },
  { id: 'lookout', labelKey: 'destinationLookout', x: 0, z: -38, heading: Math.PI / 2 },
]

export type WorldPosition = { x: number; z: number; heading: number }
