import { useEffect, useRef, useState } from 'react'
import GlassFolder, { type ArtPreset, type FolderFile } from '@/components/ui/glass-folder-cards'
import type { Card, Locale } from '@/content/types'
import folderFiles from '@/content/service-folder-files.json'

const serviceFiles = folderFiles as Record<string, { name: Record<Locale, string> }[]>

const presets: ArtPreset[] = ['glacier', 'aurora', 'dusk', 'ember', 'verdant', 'glacier', 'aurora']
function ServiceFolder({ item, index, locale, ui }: { item: Card; index: number; locale: Locale; ui: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(280)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const resize = () => setWidth(Math.max(1, Math.min(340, element.clientWidth)))
    resize()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const href = (path: string) => `#/${locale}/${path}`
  const files: FolderFile[] = (serviceFiles[item.path] ?? []).map(file => ({
    name: file.name[locale], href: href(item.path),
  }))
  return <article className="service-folder-card">
    <div className="folder-visual" ref={ref}>
      <GlassFolder label={item.title} meta={`${files.length} ${ui.folderItems}`} art={presets[index % presets.length]} seed={index * 7 + 3} tone={index === 3 || index === 4 ? 'dark' : 'light'} action="none" files={files} width={width} className="service-folder" appear={false} labels={{ open: ui.folderOpen, close: ui.folderClose, contents: ui.folderContents }} />
    </div>
    <div className="service-folder-copy"><h3><a className="service-title-link" href={href(item.path)}>{item.title}</a></h3><p>{item.text}</p></div>
  </article>
}
export default function ServiceFolders({ items, locale, ui }: { items: Card[]; locale: Locale; ui: Record<string, string> }) {
  return <><p className="folder-hint">{ui.folderHint}</p><div className={`folder-grid${items.length === 7 ? ' folder-grid--seven' : ''}`}>{items.map((item, index) => <ServiceFolder key={item.path} item={item} index={index} locale={locale} ui={ui} />)}</div></>
}
