/** A deterministic SVG pose; uses no images, network requests or external libraries. */
export function buildSnakePose(seconds, scrollProgress = 0) {
  const time = Number.isFinite(seconds) ? seconds : 0
  const progress = Math.max(0, Math.min(1, Number.isFinite(scrollProgress) ? scrollProgress : 0))
  const phase = time * .9 + progress * .55
  const points = Array.from({ length: 49 }, (_, index) => {
    const t = index / 48
    const amplitude = 6 + 18 * Math.sin(t * Math.PI * .5)
    return { x: 66 + Math.sin(t * Math.PI * 3.25 - phase) * amplitude, y: 154 - 122 * t }
  })
  const fixed = value => Number(value.toFixed(2))
  let path = `M${fixed(points[0].x)} ${fixed(points[0].y)}`
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)]
    path += `C${fixed(b.x + (c.x - a.x) / 6)} ${fixed(b.y + (c.y - a.y) / 6)} ${fixed(c.x - (d.x - b.x) / 6)} ${fixed(c.y - (d.y - b.y) / 6)} ${fixed(c.x)} ${fixed(c.y)}`
  }
  const head = points[points.length - 1], previous = points[points.length - 2]
  return { path, x: fixed(head.x), y: fixed(head.y), angle: fixed(Math.atan2(head.y - previous.y, head.x - previous.x) * 180 / Math.PI), offset: fixed(-progress * 18) }
}

function scrollPoint(width, height, rawProgress) {
  const p = Math.max(0, Math.min(1, Number.isFinite(rawProgress) ? rawProgress : 0))
  const w = Math.max(24, Number.isFinite(width) ? width : 64)
  const h = Math.max(240, Number.isFinite(height) ? height : 900)
  const start = Math.min(140, h * .22), end = h - Math.min(90, h * .18)
  const amplitude = Math.min(8, w * .14), frequency = Math.PI * 3
  return { x: w / 2 + Math.sin(p * frequency) * amplitude, y: start + (end - start) * p, angle: Math.atan2(end - start, Math.cos(p * frequency) * frequency * amplitude) * 180 / Math.PI, progress: p }
}
export function buildScrollTrack(width, height, progress = 0) {
  const point = scrollPoint(width, height, progress)
  let path = ''
  for (let i = 0; i <= 96; i++) {
    const sample = scrollPoint(width, height, i / 96)
    path += `${i ? 'L' : 'M'}${sample.x.toFixed(2)} ${sample.y.toFixed(2)}`
  }
  return { path, ...point }
}
export function mountSnakeMascot(root) {
  if (!root) return () => {}
  const body = root.querySelector('.snake-body'), highlight = root.querySelector('.snake-highlight'), head = root.querySelector('.snake-head')
  const avatar = root.querySelector('.brand-snake'), trail = root.querySelector('.snake-scroll-trail')
  const guide = root.querySelector('.snake-trail-guide'), line = root.querySelector('.snake-trail-line'), reveal = root.querySelector('.snake-trail-reveal'), mask = root.querySelector('mask')
  if (!body || !head || !avatar || !trail || !guide || !line || !reveal || !mask) return () => {}
  const bodyLayers = root.querySelectorAll('[data-snake-body-layer]')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0, stopped = false, previous = -Infinity, progress = 0, target = 0, direction = 1
  let width = 64, height = 900, total = 1
  const start = performance.now()
  const draw = seconds => {
    const pose = buildSnakePose(seconds, progress)
    body.setAttribute('d', pose.path); highlight?.setAttribute('d', pose.path)
    bodyLayers.forEach(layer => layer.setAttribute('d', pose.path))
    head.setAttribute('transform', `translate(${pose.x} ${pose.y}) rotate(${pose.angle})`)
    const point = scrollPoint(width, height, progress)
    avatar.style.transform = `translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%) rotate(${point.angle + (direction > 0 ? 90 : -90)}deg)`
    reveal.setAttribute('stroke-dashoffset', String(total * (1 - progress)))
  }
  const shouldRun = () => !stopped && !document.hidden && !motion.matches
  const tick = now => {
    frame = 0
    if (!shouldRun()) return
    if (now - previous >= 1000 / 30) {
      previous = now
      progress += (target - progress) * .14
      if (Math.abs(target - progress) < .0001) progress = target
      draw((now - start) / 1000)
    }
    frame = requestAnimationFrame(tick)
  }
  const resume = () => {
    root.toggleAttribute('data-motion-off', motion.matches)
    if (!shouldRun()) { cancelAnimationFrame(frame); frame = 0; return }
    if (!frame) frame = requestAnimationFrame(tick)
  }
  const onScroll = () => {
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const next = maximum ? Math.max(0, Math.min(1, window.scrollY / maximum)) : 0
    if (Math.abs(next - target) > .0002) direction = next > target ? 1 : -1
    target = next
  }
  const resize = () => {
    width = root.clientWidth || 64; height = window.innerHeight || 900
    trail.setAttribute('viewBox', `0 0 ${width} ${height}`)
    trail.setAttribute('width', String(width)); trail.setAttribute('height', String(height))
    mask.setAttribute('width', String(width)); mask.setAttribute('height', String(height))
    const track = buildScrollTrack(width, height)
    for (const path of [guide, line, reveal]) path.setAttribute('d', track.path)
    total = guide.getTotalLength()
    reveal.setAttribute('stroke-dasharray', `${total} ${total}`)
    onScroll(); draw(0)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', resume)
  motion.addEventListener('change', resume)
  resize(); progress = target; draw(0); root.setAttribute('data-ready', ''); resume()
  return () => {
    stopped = true; cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', resume); motion.removeEventListener('change', resume)
  }
}
