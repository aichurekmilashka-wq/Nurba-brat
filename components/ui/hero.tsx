"use client"

import type { CSSProperties } from 'react'
import GlyphPortal from '@/components/ui/glyph-portal'

export type HeroProps = {
  title: string
  description: string
  eyebrow: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  portraitSrc: string
  portraitAlt: string
  logoSrc: string
  brandName: string
}

export default function BrandHero(props: HeroProps) {
  const flowers = <div className="hero-botanical-art" aria-hidden="true">
    {[1, 3, 4, 6].map(i => <span key={i} className={`botanical-bloom bloom-${i}`} style={{ '--poppy-image': `url("${props.portraitSrc.replace('four-poppies-continuous-stems.png', `poppy-blossom-${i}.png`)}")`, '--poppy-image-mobile': `url("${props.portraitSrc.replace('four-poppies-continuous-stems.png', `poppy-blossom-${i}-mobile.png`)}")` } as CSSProperties} />)}
  </div>
  return <GlyphPortal word="Nurba" className="nurba-glyph-hero" typographyOnly interactive={false}
    fontFamily={'"Glyph Portal Jakarta", Arial, sans-serif'} fontWeight={700}
    style={{ '--gp-paper': '#fff', '--gp-ink': '#000', '--gp-field': '#fff' }}
    background={flowers} front={<>
      <h1 id="hero-title">{props.title}</h1>

    </>} />
}
