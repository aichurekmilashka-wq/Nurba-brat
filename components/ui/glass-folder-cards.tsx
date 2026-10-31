"use client"

import * as React from 'react'
import { ART_PRESETS, createArtJob, fanSlot, hashString, rng, type ArtJob, type ArtPreset, type ArtRecipe } from '@/lib/folder-art'
import '@/styles/glass-folder.css'

export { ART_PRESETS, createArtJob, fanSlot, hashString, rng, hexToRgb } from '@/lib/folder-art'
export type { ArtJob, ArtPreset, ArtRecipe } from '@/lib/folder-art'
export type FolderArt = ArtPreset | ArtRecipe | 'none'
export type FolderFile = { name: string; meta?: string; art?: ArtPreset | ArtRecipe; image?: string; href?: string }
export type FolderMenuItem = { label: string; onSelect?: () => void; danger?: boolean }
export type FolderLabels = { open: string; close: string; contents: string; options: string; addFile: string; item: string; items: string; untitled: string; justNow: string }
export type GlassFolderProps = {
  label?: string; meta?: string; tone?: 'light' | 'dark'; art?: FolderArt; seed?: number; image?: string
  files?: FolderFile[]; action?: 'add' | 'more' | 'none'; onAdd?: (files: FolderFile[]) => FolderFile | void
  onFilesChange?: (files: FolderFile[]) => void; menu?: FolderMenuItem[]
  labelPlacement?: 'bottom-left' | 'top-left' | 'top-right'
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void
  onFileSelect?: (file: FolderFile, index: number) => void
  width?: number; appear?: boolean; appearDelay?: number; className?: string; style?: React.CSSProperties
  /** Optional translated interface labels; content always comes from the caller. */
  labels?: Partial<FolderLabels>
}
const DEFAULT_LABELS: FolderLabels = { open: 'Open', close: 'Close', contents: 'Contents', options: 'Options', addFile: 'Add a file', item: 'item', items: 'items', untitled: 'Untitled', justNow: 'Just now' }
const artCache = new Map<string, Promise<HTMLCanvasElement>>()
const queue: { job: ArtJob; priority: number; done: (canvas: HTMLCanvasElement) => void }[] = []
let pumping = false
function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 7
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(4)) {
        queue.shift()
        const canvas = document.createElement('canvas')
        canvas.width = head.job.width; canvas.height = head.job.height
        const context = canvas.getContext('2d')
        if (context) {
          const image = context.createImageData(canvas.width, canvas.height)
          image.data.set(head.job.pixels); context.putImageData(image, 0, 0)
        }
        head.done(canvas)
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}
function paint(recipe: ArtRecipe, seed: number, width: number, height: number, priority: number) {
  const key = JSON.stringify([recipe, seed, width, height])
  let result = artCache.get(key)
  if (!result) {
    result = new Promise<HTMLCanvasElement>(done => {
      let at = queue.length
      while (at > 1 && queue[at - 1].priority > priority) at--
      queue.splice(at, 0, { job: createArtJob(width, height, recipe, seed), priority, done })
      pump()
    })
    artCache.set(key, result)
  }
  return result
}
function ArtCanvas({ art, seed, w, h, density, priority, className }: { art: ArtPreset | ArtRecipe; seed: number; w: number; h: number; density: number; priority: number; className?: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const recipe = typeof art === 'string' ? ART_PRESETS[art] : art
  const key = JSON.stringify(recipe)
  const pw = Math.round(w * density), ph = Math.round(h * density)
  React.useEffect(() => {
    let live = true
    setReady(false)
    paint(JSON.parse(key) as ArtRecipe, seed, pw, ph, priority).then(source => {
      if (!live || !ref.current) return
      const canvas = ref.current
      canvas.width = source.width; canvas.height = source.height
      canvas.getContext('2d')?.drawImage(source, 0, 0)
      setReady(true)
    })
    return () => { live = false }
  }, [key, seed, pw, ph, priority])
  return <canvas ref={ref} aria-hidden="true" className={className} data-ready={ready || undefined} style={{ width: w, height: h, maxWidth: 'none' }} />
}
const W = 340, H = 272, HEADROOM = 54, FRONT_H = 198, SHEET_W = 272, SHEET_H = 184
const BACK_PATH = 'M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z'
const FRONT_PATH = 'M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z'
const SAMPLE_FILES: FolderFile[] = [{ name: 'Cover — final', meta: 'PNG · 4.8 MB', art: 'ember' }, { name: 'Moodboard', meta: '24 images', art: 'dusk' }, { name: 'Brief.pdf', meta: 'PDF · 1.2 MB' }]

export default function GlassFolder({ label = 'My Files', meta, tone = 'light', art = 'aurora', seed = 3, image, files: initialFiles = SAMPLE_FILES, action = 'add', onAdd, onFilesChange, menu = [], labelPlacement = 'bottom-left', open: openProp, defaultOpen = false, onOpenChange, onFileSelect, width = 340, appear = true, appearDelay = 0, className, style, labels }: GlassFolderProps) {
  const words = { ...DEFAULT_LABELS, ...labels }
  const uid = React.useId().replace(/:/g, '')
  const rootRef = React.useRef<HTMLDivElement>(null)
  const hitRef = React.useRef<HTMLButtonElement>(null)
  const keyRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [files, setFiles] = React.useState(initialFiles)
  const ids = React.useRef(initialFiles.map((_, i) => i))
  const nextId = React.useRef(initialFiles.length)
  const [dropped, setDropped] = React.useState<number | null>(null)
  const [bump, setBump] = React.useState(0)
  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = React.useCallback((next: boolean) => {
    if (openProp === undefined) setOpenState(next)
    onOpenChange?.(next)
  }, [openProp, onOpenChange])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [entered, setEntered] = React.useState(!appear)
  const k = Math.max(1, width) / W
  const density = Math.min(1.5, Math.max(1, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1)) * k
  React.useEffect(() => {
    const el = rootRef.current
    if (!appear || !el || typeof IntersectionObserver === 'undefined') { setEntered(true); return }
    let timer = 0
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect(); timer = window.setTimeout(() => setEntered(true), appearDelay)
    }, { threshold: .25 })
    observer.observe(el)
    return () => { observer.disconnect(); window.clearTimeout(timer) }
  }, [appear, appearDelay])
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let raf = 0, px = 0, py = 0
    const write = () => { raf = 0; el.style.setProperty('--gf-px', px.toFixed(3)); el.style.setProperty('--gf-py', py.toFixed(3)) }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      px = ((event.clientX - rect.left) / rect.width) * 2 - 1
      py = ((event.clientY - rect.top) / rect.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => { px = 0; py = 0; if (!raf) raf = requestAnimationFrame(write) }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf) }
  }, [])
  React.useEffect(() => {
    if (!open && !menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      // Only the folder containing focus handles a keyboard dismissal.
      if (!rootRef.current?.contains(document.activeElement)) return
      if (menuOpen) { setMenuOpen(false); keyRef.current?.focus() }
      else { setOpen(false); hitRef.current?.focus() }
    }
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuOpen && !menuRef.current?.contains(target) && !keyRef.current?.contains(target)) setMenuOpen(false)
      if (open && !menuOpen && !rootRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open, menuOpen, setOpen])
  React.useEffect(() => { if (menuOpen) menuRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus() }, [menuOpen])
  const addFile = () => {
    const file = onAdd?.(files) || { name: `${words.untitled} ${files.length + 1}`, meta: words.justNow }
    const next = [...files, file], id = nextId.current++
    ids.current = [...ids.current, id]; setFiles(next); setDropped(id); setBump(value => value + 1); onFilesChange?.(next)
  }
  const menuItems: FolderMenuItem[] = [{ label: `${open ? words.close : words.open} ${label}`, onSelect: () => setOpen(!open) }, ...menu]
  const onMenuKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])
    const at = items.indexOf(document.activeElement as HTMLElement)
    const go = (index: number) => { event.preventDefault(); items[(index + items.length) % items.length]?.focus() }
    if (event.key === 'ArrowDown') go(at + 1)
    else if (event.key === 'ArrowUp') go(at - 1)
    else if (event.key === 'Home') go(0)
    else if (event.key === 'End') go(items.length - 1)
    else if (event.key === 'Tab') window.setTimeout(() => setMenuOpen(false), 0)
  }
  const start = Math.max(0, files.length - 4), visible = files.slice(start), count = files.length
  const metaLine = meta ?? `${count} ${count === 1 ? words.item : words.items}`
  return <div ref={rootRef} className={`gf-root${className ? ` ${className}` : ''}`} data-tone={tone} data-open={open || undefined} data-entered={entered || undefined} data-place={labelPlacement} style={{ width: Math.max(1, width), height: (H + HEADROOM) * k, ...style }}>
    <div className="gf-stage" style={{ transform: `translateY(${HEADROOM * k}px) scale(${k})` }}><div className="gf-tilt">
      <div className="gf-shadow" aria-hidden="true" />
      <div className="gf-back" style={{ clipPath: `path('${BACK_PATH}')` }} aria-hidden="true">
        {image ? <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} /> : art !== 'none' ? <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} /> : null}
        <div className="gf-back-sheen" />
      </div>
      <svg className="gf-rim gf-back-rim" viewBox={`0 0 ${W} ${H}`} aria-hidden="true"><path d={BACK_PATH} /></svg>
      <div key={bump} className={`gf-front${bump ? ' gf-front--bump' : ''}`} style={{ clipPath: `path('${FRONT_PATH}')` }}>
        <div className="gf-tint" aria-hidden="true" /><div className="gf-spec" aria-hidden="true" />
        <svg className="gf-rim gf-front-rim" viewBox={`0 0 ${W} ${FRONT_H}`} aria-hidden="true"><defs><linearGradient id={`gf-rim-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset=".35" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity=".12" /></linearGradient></defs><path d={FRONT_PATH} stroke={`url(#gf-rim-${uid})`} /></svg>
        <button ref={hitRef} type="button" className="gf-hit" aria-expanded={open} aria-controls={`gf-files-${uid}`} aria-label={`${open ? words.close : words.open} ${label}, ${metaLine}`} onClick={() => { setMenuOpen(false); setOpen(!open) }} />
        <div className="gf-label"><span className="gf-title">{label}</span><span className="gf-meta" key={metaLine}>{metaLine}</span></div>
      </div>
      <div id={`gf-files-${uid}`} className="gf-files" role="list" aria-label={`${label}: ${words.contents}`} inert={!open}>
        {visible.map((file, v) => {
          const id = ids.current[start + v], jitter = rng(hashString(file.name) + id), picture = Boolean(file.art || file.image)
          const inner = <>
            {picture ? file.image ? <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} /> : <ArtCanvas className="gf-sheet-art" art={file.art as ArtPreset | ArtRecipe} seed={hashString(file.name) % 997} w={SHEET_W} h={SHEET_H} density={Math.min(density, 1.25)} priority={1} /> : <span className="gf-lines" aria-hidden="true">{['86%', '92%', '64%', '88%', '42%'].map(value => <i key={value} style={{ width: value }} />)}</span>}
            <span className="gf-sheet-head"><span className="gf-sheet-name">{file.name}</span>{file.meta && <span className="gf-sheet-meta">{file.meta}</span>}</span>
          </>
          const common = { className: `gf-sheet${picture ? ' gf-sheet--art' : ''}${id === dropped ? ' gf-sheet--drop' : ''}`, style: { '--gf-slot': fanSlot(v, visible.length), '--gf-depth': visible.length - 1 - v, '--gf-jx': `${((jitter() - .5) * 10).toFixed(2)}px`, '--gf-jr': `${((jitter() - .5) * 3.2).toFixed(2)}deg`, zIndex: v + 1 } as React.CSSProperties, onAnimationEnd: id === dropped ? () => setDropped(null) : undefined }
          return <div key={id} role="listitem" className="gf-sheet-slot">{file.href ? <a {...common} href={file.href} onClick={() => onFileSelect?.(file, start + v)}>{inner}</a> : <button {...common} type="button" onClick={() => onFileSelect?.(file, start + v)}>{inner}</button>}</div>
        })}
      </div>
      {action !== 'none' && <button ref={keyRef} type="button" className={`gf-key gf-key--${action}`} aria-label={`${action === 'add' ? words.addFile : words.options}: ${label}`} aria-haspopup={action === 'more' ? 'menu' : undefined} aria-expanded={action === 'more' ? menuOpen : undefined} aria-controls={action === 'more' ? `gf-menu-${uid}` : undefined} onClick={() => action === 'add' ? addFile() : setMenuOpen(value => !value)}>
        {action === 'add' ? <svg key={bump} className="gf-glyph gf-glyph--plus" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5v15M4.5 12h15" /></svg> : <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">{[1, 11, 21].map(x => <rect key={x} x={x} y="1.5" width="8" height="9" rx="3.4" />)}</svg>}
      </button>}
      {action === 'more' && <div ref={menuRef} id={`gf-menu-${uid}`} role="menu" aria-label={`${label}: ${words.options}`} className="gf-menu" data-open={menuOpen || undefined} onKeyDown={onMenuKey} inert={!menuOpen}>
        {menuItems.map((item, i) => <button key={`${item.label}-${i}`} type="button" role="menuitem" tabIndex={-1} disabled={!menuOpen} className={`gf-menu-item${item.danger ? ' gf-menu-item--danger' : ''}`} onClick={() => { setMenuOpen(false); keyRef.current?.focus(); item.onSelect?.() }}>{item.label}</button>)}
      </div>}
    </div></div>
  </div>
}
