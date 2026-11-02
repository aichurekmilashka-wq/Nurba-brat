import ProjectJourney from '@/components/ui/project-journey'
import ThemeToggle from "@/components/theme-toggle"
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import source from '@/content/site.json'
import type { Block, Card, Locale, SiteData } from '@/content/types'
import BrandHero from '@/components/ui/hero'
import { mountScrollReveal } from '@/lib/scroll-reveal'
import ServiceFolders from '@/components/service-folders'
import DropdownNavigation from '@/components/dropdown-navigation'
import LanguageSwitcher from '@/components/language-switcher'

const data = source as unknown as SiteData
const brandLogo = `${import.meta.env.BASE_URL}assets/nurba-black-sans.svg`
const languages = Object.keys(data.languages) as Locale[]

function currentRoute(): { locale: Locale; path: string } {
  const [candidate, ...parts] = location.hash.replace(/^#\/?/, '').split('/')
  const locale = languages.includes(candidate as Locale) ? candidate as Locale : 'ru'
  return { locale, path: parts.join('/').replace(/\/$/, '') }
}

function Cards({ items, locale, more }: { items: Card[]; locale: Locale; more: string }) {
  if (items.length && items.every(item => item.path.startsWith('services/'))) return <ServiceFolders items={items} locale={locale} ui={data.locales[locale].ui} />
  return <div className="cards">{items.map((item, i) => <a className="card" href={`#/${locale}/${item.path}`} key={item.path}>
    <span className="card-no">{String(i + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.text}</p><span className="card-link button-7 site-action" style={{ "--button-7-width": `${Math.max(128,72 + more.length * 8)}px` } as import("react").CSSProperties}><span className="button-7-label">{more}</span><span className="button-7-arrow" aria-hidden="true"><ArrowRight size={20} /></span></span>
  </a>)}</div>
}

function RequestForm({ title }: { locale: Locale; title: string }) {
  return <section className="request-layout"><div><h2 className="section-title">{title}</h2><p className="request-note">Приём заявок временно приостановлен. Форма не собирает и не отправляет персональные данные.</p></div></section>
}

function Search({ block, locale }: { block: Extract<Block, { type: 'cards' | 'search' }>; locale: Locale }) {
  const [query, setQuery] = useState('')
  const t = data.locales[locale].ui
  const items = block.items.filter(item => `${item.title} ${item.text}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)))
  return <><label><span className="sr-only">{t.search}</span><input className="search-field" type="search" value={query} placeholder={t.search} onChange={event => setQuery(event.target.value)} /></label>{items.length ? <Cards items={items} locale={locale} more={t.more} /> : <p className="search-empty" role="status">{t.noResults}</p>}</>
}

function ContentBlock({ block, index, locale }: { block: Block; index: number; locale: Locale }) {
  const t = data.locales[locale].ui
  return <section className="content-section"><div className="shell">
    {block.type === 'form' ? <RequestForm locale={locale} title={block.title} /> : <>
      <div className="section-head"><h2 className="section-title">{block.title}</h2><span className="section-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
      {block.type === 'text' && <p className="body-copy">{block.text}</p>}
      {block.type === 'cards' && <>{block.text && <p className="section-lead">{block.text}</p>}<Cards items={block.items} locale={locale} more={t.more} />{block.morePath && <a className="section-more" href={`#/${locale}/${block.morePath}`}>{block.moreLabel} <ArrowRight size={18} aria-hidden="true" /></a>}</>}
      {block.type === 'search' && <Search block={block} locale={locale} />}
      {block.type === 'journey' && <ProjectJourney items={block.items} locale={locale} title={block.title} />}
      {block.type === 'steps' && <ol className="steps">{block.items.map(item => <li key={item}>{item}</li>)}</ol>}
      {block.type === 'checklist' && <><p className="body-copy">{block.text}</p><ul className="document-checklist">{block.items.map(item=><li key={item}><label><input type="checkbox" /><span>{item}</span></label></li>)}</ul></>}
      {block.type === 'faq' && <div className="faq-list">{block.items.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>}
    </>}
  </div></section>
}

export default function Website() {
  const [route, setRoute] = useState(currentRoute)
  useEffect(() => {
    const update = () => { setRoute(currentRoute()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const { locale, path } = route
  const { ui: t, pages } = data.locales[locale]
  const page = pages[path] || pages['404']
  useEffect(() => mountScrollReveal(), [locale, path])
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = `${page.title} | ${t.brandName}`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', page.lead || page.title)
  }, [locale, page, t.brandName])
  const href = (target: string) => `#/${locale}/${target}`
  return <>
    <header className="site-header"><div className="shell header-inner">
      <DropdownNavigation locale={locale} path={path} ui={t} pages={pages} />
      <LanguageSwitcher locale={locale} path={path} languages={data.languages} />
      <ThemeToggle locale={locale} />
    </div></header>
    <main id="main" className={path.startsWith('knowledge/') ? 'knowledge-article' : undefined} key={`${locale}/${path}`}>
      {path === '' ? <BrandHero portraitSrc={`${import.meta.env.BASE_URL}assets/four-poppies-continuous-stems.png`} portraitAlt={t.portraitAlt} logoSrc={brandLogo} brandName={t.brandName} title={page.title} description={page.lead} eyebrow={t.region} primaryLabel={t.request} primaryHref={href('request')} secondaryLabel={t.how} secondaryHref={href('how-we-work')} /> : <div className="page-heading"><div className="shell"><nav className="breadcrumbs" aria-label={t.home}><a href={href('')}>{t.home}</a><span aria-hidden="true">/</span><span>{page.title}</span></nav><h1>{page.title}</h1>{page.lead && <p>{page.lead}</p>}</div></div>}
      {page.blocks.map((block, index) => <ContentBlock block={block} index={index} locale={locale} key={`${block.type}-${index}`} />)}
    </main>
    <footer className="site-footer"><div className="shell"><div className="footer-grid">
      <div className="footer-intro"><h2>{t.brandName}</h2><p>{t.footerText}</p></div>
      <nav className="footer-links" aria-label={t.navMenu}>{['services','pricing','how-we-work','knowledge'].map(target => <a key={target} href={href(target)}>{pages[target].title}</a>)}</nav>
    </div><div className="footer-bottom"><span>{t.region}</span><div className="footer-legal">{['privacy','cookies','terms'].map(target => <a key={target} href={href(target)}>{pages[target].title}</a>)}</div></div></div></footer>
  </>
}
