'use client'

import { useSyncExternalStore } from 'react'
import { getReducedMotionPreference, subscribeMotionPreference } from './motion-preference'

const serverReducedMotion = () => true

/** One live preference for all progressive motion enhancements. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeMotionPreference, getReducedMotionPreference, serverReducedMotion)
}
