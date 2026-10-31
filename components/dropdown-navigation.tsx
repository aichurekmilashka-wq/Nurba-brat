import { Component as Button7 } from "@/components/ui/button-7"
import { useEffect, useId, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import groups from '@/content/navigation.json'
import type { Locale, Page } from '@/content/types'
import { mountDropdownNavigation } from '@/lib/dropdown-navigation'

export default function DropdownNavigation({ locale, path, ui, pages }: { locale: Locale; path: string; ui: Record<string, string>; pages: Record<string, Page> }) {
  const ref = useRef<HTMLElement>(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => mountDropdownNavigation(ref.current), [locale, path])
  return <nav ref={ref} className="site-nav" aria-label={ui.navMenu}>
    <details className="nav-dropdown main-menu-dropdown">
      <Button7 asChild label={ui.navMenu} icon="menu"><summary className="nav-trigger" aria-controls={`${id}-menu`} /></Button7>
      <div className="nav-panel main-menu-panel" id={`${id}-menu`}>
        <a href={`#/${locale}/`}>{ui.home}</a>
        {groups.map(group => group.pages.length === 1 ? <a key={group.label} href={`#/${locale}/${group.pages[0]}`} aria-current={path === group.pages[0] ? 'page' : undefined}>{ui[group.label]}</a> : <details className="nav-subgroup" key={group.label}>
          <summary className="nav-group-trigger" aria-controls={`${id}-${group.label}`}><span>{ui[group.label]}</span><ChevronDown size={14} aria-hidden="true" /></summary>
          <div className="nav-subpanel" id={`${id}-${group.label}`}>
            {group.pages.map(target => <a key={target} href={`#/${locale}/${target}`} aria-current={path === target ? 'page' : undefined}>{target === 'services' ? ui.allServices : pages[target].title}</a>)}
          </div>
        </details>)}
      </div>
    </details>
  </nav>
}
