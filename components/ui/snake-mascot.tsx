"use client"

import { useEffect, useRef } from 'react'
import snakeSvg from './brand-snake.svg?raw'
import trailSvg from './snake-trail.svg?raw'
import { mountSnakeMascot } from '@/lib/snake-mascot'

/** Local trusted SVG artwork. Fixed in a reserved gutter, never over interactive content. */
export default function SnakeMascot() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => mountSnakeMascot(ref.current), [])
  return <div ref={ref} className="snake-scroll-rail" aria-hidden="true" dangerouslySetInnerHTML={{ __html: `${trailSvg}<div class="brand-snake">${snakeSvg}</div>` }} />
}
