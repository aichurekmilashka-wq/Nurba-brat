"use client"
import GlyphPortal from "@/components/ui/glyph-portal"

export default function GlyphPortalDemo() {
  return <div style={{ height: "min(720px,100svh)", overflowY: "auto" }}>
    <GlyphPortal word="SUBLIME" fontFamily={'"Glyph Portal Jakarta",Arial,sans-serif'} fontWeight={700} scrollLength={2.4} enterLabel="Step inside" />
  </div>
}
