"use client"

import { useEffect, useState } from 'react'
import { MeshGradient, PulsingBorder } from '@paper-design/shaders-react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export type HeroProps = {
  title: string
  description: string
  eyebrow: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}

export default function ShaderShowcase(props: HeroProps) {
  const reducedMotion = useReducedMotion()
  const [webgl, setWebgl] = useState(false)
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    setWebgl(Boolean(context))
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  }, [])

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="mesh-fallback" aria-hidden="true" />
      {webgl && <div className="shader-mount" aria-hidden="true">
        <MeshGradient className="absolute inset-0 h-full w-full" colors={['#0c1d33', '#1e4775', '#6e9dbc', '#2c5977']} speed={reducedMotion ? 0 : 0.2} maxPixelCount={1_000_000} />
      </div>}
      <div className="hero-veil" aria-hidden="true" />
      <div className="shell hero-inner">
        <div className="hero-orbit" aria-hidden="true">
          {webgl && <PulsingBorder colors={['#93b6dc', '#d4e3f3']} colorBack="#00000000" roundness={1} thickness={0.025} intensity={0.35} spots={3} spotSize={0.3} smoke={0.1} smokeSize={0.3} speed={reducedMotion ? 0 : 0.3} style={{ width: '100%', height: '100%' }} />}
        </div>
        <div className="eyebrow">{props.eyebrow}</div>
        <motion.h1 id="hero-title" initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>{props.title}</motion.h1>
        <p>{props.description}</p>
        <div className="hero-actions">
          <a className="button button-primary" href={props.primaryHref}>{props.primaryLabel}<ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="button button-secondary" href={props.secondaryHref}>{props.secondaryLabel}<span aria-hidden="true">↗</span></a>
        </div>
        <div className="hero-bottom" aria-label="Website languages"><span>RU · KY · EN · SV · NB</span><span>KYRGYZSTAN / REGULATORY</span></div>
      </div>
    </section>
  )
}
