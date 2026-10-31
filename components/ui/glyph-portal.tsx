"use client"

/**
 * Glyph Portal © 2026 Christian Katzmann. MIT.
 * Origin: UsefulPortal.astro on https://ktzm.dk → UsefulPortal.tsx → ClarityPortal.tsx.
 * A scroll-driven camera through live type. Keep this notice with copies.
 * Shared-runtime adaptation for React and offline HTML; optional static typography mode.
 */
import { useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { mountGlyphPortal } from "@/lib/glyph-portal"

export type GlyphPortalStyle = CSSProperties & {
  "--gp-paper"?: string; "--gp-ink"?: string; "--gp-field"?: string; "--gp-foreground"?: string
}
export type GlyphPortalProps = {
  word?: string; focusChar?: string; interactive?: boolean; background?: ReactNode; front?: ReactNode;
  children?: ReactNode; scrollLength?: number; fontFamily?: string; fontWeight?: number;
  annotations?: boolean; enterLabel?: string; className?: string; style?: GlyphPortalStyle;
  onProgress?: (progress: number) => void;
  /** Keep the supplied typography and framing without the scroll camera. */
  typographyOnly?: boolean
}
const DEFAULT_FONT = '"Arial Black", Arial, sans-serif'

export default function GlyphPortal({
  word = "SUBLIME", focusChar, interactive = true, background, front, children, scrollLength = 2.4,
  fontFamily = DEFAULT_FONT, fontWeight = 900, annotations = false, enterLabel = "Enter section",
  className, style, onProgress, typographyOnly = false,
}: GlyphPortalProps) {
  const uid = `gp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const ref = useRef<HTMLElement>(null), callback = useRef(onProgress)
  useLayoutEffect(() => { callback.current = onProgress }, [onProgress])
  const text = word.trim().normalize("NFC") || "SUBLIME"
  const length = Number.isFinite(scrollLength) ? Math.max(1, Math.min(8, scrollLength)) : 2.4
  const weight = Number.isFinite(fontWeight) ? Math.max(1, Math.min(1000, fontWeight)) : 900
  let offset = 0
  const characters = Array.from(text, char => { const index = offset; offset += char.length; return { char, index } })
  useLayoutEffect(() => mountGlyphPortal(ref.current, {
    word: text, focusChar, interactive, scrollLength: length, typographyOnly,
    onProgress: progress => callback.current?.(progress),
  }), [text, focusChar, interactive, length, typographyOnly, fontFamily, weight])
  const glyph = <text data-gp-glyph x="0" y="0" style={{ fontFamily, fontWeight: weight, fontSize: 100, fontKerning: "none", fontVariantLigatures: "none", letterSpacing: 0 }}>{text}</text>
  return <section ref={ref} id={uid} className={`glyph-portal${className ? ` ${className}` : ""}`} aria-label={text}
    data-gp-word={text} data-gp-typography={typographyOnly ? "true" : undefined}
    style={{ "--gp-length": length, "--gp-characters": characters.length, ...style } as CSSProperties}>
    <div data-gp-viewport aria-hidden="true" />
    <div data-gp-pin>
      <div data-gp-field aria-hidden="true" inert>{background ?? <div data-gp-default-field />}</div>
      <svg data-gp-art aria-hidden="true" focusable="false">
        {typographyOnly ? glyph : <defs><clipPath id={`${uid}-clip`} clipPathUnits="userSpaceOnUse">{glyph}</clipPath></defs>}
        <g data-gp-marks style={{ visibility: annotations ? "visible" : "hidden" }}><path /></g>
      </svg>
      <div data-gp-choices role="radiogroup" aria-label="Choose the letter to enter through" inert>
        {characters.map(({ char, index }, i) => <button type="button" role="radio" aria-checked="false" tabIndex={-1} data-gp-letter={index} key={index} aria-label={`${char}, letter ${i + 1} of ${characters.length}`} />)}
      </div>
      <label data-gp-touch-picker><span className="gp-sr-only">Entry letter</span><select data-gp-select defaultValue="">
        <option value="" disabled>Choose a letter</option>
        {characters.map(({ char, index }, i) => <option key={index} value={index}>{i + 1} · {char}</option>)}
      </select></label>
      {front && <div data-gp-front>{front}</div>}
      <span data-gp-fallback aria-hidden="true" style={{ fontFamily, fontWeight: weight }}>{text}</span>
      {!typographyOnly && <div data-gp-caption><span data-gp-hint aria-hidden="true">{interactive ? "Scroll to enter." : annotations ? "A passage through type" : ""}</span><a data-gp-enter href={`#${uid}-content`}>{enterLabel}<span aria-hidden="true">↘</span></a></div>}
    </div>
    {!typographyOnly && <div data-gp-content id={`${uid}-content`} tabIndex={-1}>{children ?? <div><h2 data-gp-default-title>A letter becomes a place.</h2><p data-gp-default-copy>The shape opens onto whatever comes next.</p></div>}</div>}
  </section>
}
