'use client'

import Image from 'next/image'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'

/** Original-color recording, with a static image for system or in-site Motion OFF. */
export function AnimatedWorkCover({ src, fallback, alt, width, height, sizes }: {
  src?: string
  fallback: string
  alt: string
  width: number
  height: number
  sizes?: string
}) {
  const reducedMotion = useReducedMotion()
  const animated = Boolean(src) && !reducedMotion
  return <Image src={animated ? src! : fallback} alt={alt} width={width} height={height} sizes={sizes} unoptimized={animated} />
}
