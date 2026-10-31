import { Component as Button7 } from "@/components/ui/button-7"
import { useEffect, useId, useRef } from 'react'
import { Check } from 'lucide-react'
import type { Locale } from '@/content/types'
import { mountDropdownNavigation } from '@/lib/dropdown-navigation'

const languageLabel: Record<Locale, string> = { ru: 'Язык', ky: 'Тил', en: 'Language', sv: 'Språk', nb: 'Språk' }
const languageShort: Record<Locale, string> = { ru: 'Рус', ky: 'Кыр', en: 'Eng', sv: 'Sve', nb: 'Nor' }

export default function LanguageSwitcher({ locale, path, languages }: { locale: Locale; path: string; languages: Record<Locale, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId().replace(/:/g, '')
  useEffect(() => mountDropdownNavigation(ref.current), [locale, path])
  return <div ref={ref} className="language-switcher">
    <details className="nav-dropdown language-dropdown">
      <Button7 asChild label={languageLabel[locale]} iconLabel={languageShort[locale]}><summary className="nav-trigger language-trigger" aria-controls={`${id}-languages`} /></Button7>
      <div id={`${id}-languages`} className="nav-panel language-panel">
        {(Object.keys(languages) as Locale[]).map(code => <a key={code} href={`#/${code}/${path}`} lang={code} hrefLang={code} aria-current={code === locale ? 'true' : undefined}><span>{languages[code]}</span>{code === locale && <Check size={14} aria-hidden="true" />}</a>)}
      </div>
    </details>
  </div>
}
