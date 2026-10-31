import ProjectJourney from '@/components/ui/project-journey'
import { Component as Button7 } from "@/components/ui/button-7"
import ThemeToggle from "@/components/theme-toggle"
import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Phone } from 'lucide-react'
import source from '@/content/site.json'
import type { Block, Card, Locale, SiteData } from '@/content/types'
import BrandHero from '@/components/ui/hero'
import { mountScrollReveal } from '@/lib/scroll-reveal'
import ServiceFolders from '@/components/service-folders'
import DropdownNavigation from '@/components/dropdown-navigation'
import LanguageSwitcher from '@/components/language-switcher'
import ContactChannels from '@/components/contact-channels'

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

function RequestForm({ locale, title }: { locale: Locale; title: string }) {
  const t = data.locales[locale].ui
  const [status, setStatus] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const contact = String(values.get('contact') || '').trim()
    const input = form.elements.namedItem('contact') as HTMLInputElement
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || (/^[+\d\s().-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 7)
    if (!valid) { input.setCustomValidity(t.formError); input.reportValidity(); return }
    input.setCustomValidity('')
    const text = ['task', 'country', 'contact', 'name', 'comment'].map(key => `${t[key]}: ${String(values.get(key) || '').trim()}`).join('\n\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = `project-request-${locale}.txt`; link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus(t.formSuccess)
  }
  return <div className="request-layout"><div><h2 className="section-title">{title}</h2><p className="request-note">{t.formNote}</p></div>
    <form className="request-form" onSubmit={submit}>
      <label className="field">{t.task}<select name="task" required>{['medicines', 'devices', 'review', 'preparation', 'variations', 'pv', 'consulting'].map(key => <option key={key}>{t[key]}</option>)}</select></label>
      <label className="field">{t.country}<input name="country" required autoComplete="country-name" maxLength={100} /></label>
      <label className="field full">{t.contact}<input name="contact" required maxLength={200} onInput={event => event.currentTarget.setCustomValidity('')} /></label>
      <label className="field full">{t.name}<input name="name" autoComplete="organization" maxLength={200} /></label>
      <label className="field full">{t.comment}<textarea name="comment" maxLength={3000} /></label>
      <div className="form-bottom"><Button7 className="button site-action" type="submit" label={t.submit} /><p role="status">{status}</p></div>
    </form></div>
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
      {block.type === 'contacts' && <>{block.text && <p className="section-lead">{block.text}</p>}<ContactChannels ui={t} /></>}
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
    <a className="header-contact" href={href('contacts')} aria-label={t.contactAction} title={t.contactAction}><Phone size={22} aria-hidden="true" /></a>
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
      <div className="footer-contact-group"><h2><a href={href('contacts')}>{t.contacts}</a></h2><ContactChannels ui={t} compact /></div>
    </div><div className="footer-bottom"><span>{t.region}</span><div className="footer-legal">{['privacy','cookies','terms'].map(target => <a key={target} href={href(target)}>{pages[target].title}</a>)}</div></div></div></footer>
  </>
}
