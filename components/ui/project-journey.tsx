"use client"
import { useEffect, useId, useRef } from 'react'
import type { Locale } from '@/content/types'
import descriptions from '@/content/project-journey.json'
import { mountProjectJourney } from '@/lib/project-journey'

export default function ProjectJourney({ items, locale, title }: { items: string[]; locale: Locale; title: string }) {
  const ref=useRef<HTMLDivElement>(null)
  const uid=useId().replace(/[^a-zA-Z0-9]/g,'')
  useEffect(()=>mountProjectJourney(ref.current),[items,locale])
  return <div ref={ref} className="project-journey" data-project-journey>
    <div className="journey-map">
      <svg className="journey-road" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true"><path d="M200 104H1000C1160 104 1160 316 1000 316H200" /></svg>
      <div className="journey-grid" role="tablist" aria-label={title}>
        {items.map((item,i)=><button key={i} type="button" role="tab" id={`${uid}-step-${i}`} aria-controls={`${uid}-panel-${i}`} aria-selected={i===0} tabIndex={i===0?0:-1} data-journey-step={i} className={`journey-node journey-node-${i+1}`}>
          <span className="journey-art"><img src={`${import.meta.env.BASE_URL}assets/journey-stage-${i+1}.svg`} width={160} height={160} alt="" loading="lazy" /></span>
          <span className="journey-number">{String(i+1).padStart(2,'0')}</span>
          <span className="journey-title">{item}</span>
        </button>)}
      </div>
    </div>
    <div className="journey-details">
      {items.map((item,i)=><div key={i} role="tabpanel" id={`${uid}-panel-${i}`} aria-labelledby={`${uid}-step-${i}`} data-journey-panel hidden={i!==0} tabIndex={0} className="journey-panel">
        <span className="journey-detail-number">{String(i+1).padStart(2,'0')} / {String(items.length).padStart(2,'0')}</span>
        <div><h3>{item}</h3><p>{descriptions[locale][i]}</p></div>
      </div>)}
    </div>
  </div>
}
