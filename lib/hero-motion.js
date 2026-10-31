/** Subtle artwork response; no perpetual JS animation or motion when the user opts out. */
export function mountHeroMotion(root) {
  if (!root) return () => {}
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0, stopped = false, visible = true, x = 0, y = 0
  const write = () => {
    frame = 0
    if (stopped || preference.matches || !visible) return
    const rect = root.getBoundingClientRect()
    const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(1, rect.height)))
    root.style.setProperty('--hero-x', `${(x * 7).toFixed(2)}px`)
    root.style.setProperty('--hero-y', `${(y * 4 + progress * 14).toFixed(2)}px`)
  }
  const schedule = () => { if (!frame && !stopped && visible && !preference.matches) frame = requestAnimationFrame(write) }
  const pointer = event => {
    if (event.pointerType === 'touch') return
    const rect = root.getBoundingClientRect()
    x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1))
    y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1))
    schedule()
  }
  const leave = () => { x = 0; y = 0; schedule() }
  const changed = () => {
    root.style.setProperty('--hero-x', '0px'); root.style.setProperty('--hero-y', '0px')
    if (preference.matches) { cancelAnimationFrame(frame); frame = 0 } else schedule()
  }
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting)
    root.toggleAttribute('data-hero-paused', !visible)
    if (visible) schedule()
  })
  observer?.observe(root)
  root.addEventListener('pointermove', pointer); root.addEventListener('pointerleave', leave)
  window.addEventListener('scroll', schedule, { passive: true })
  preference.addEventListener('change', changed)
  schedule()
  return () => {
    stopped = true; cancelAnimationFrame(frame); observer?.disconnect()
    root.removeEventListener('pointermove', pointer); root.removeEventListener('pointerleave', leave)
    window.removeEventListener('scroll', schedule); preference.removeEventListener('change', changed)
    root.style.removeProperty('--hero-x'); root.style.removeProperty('--hero-y'); root.removeAttribute('data-hero-paused')
  }
}
