/** Progressive enhancement: off-screen content animates once, without a scroll listener. */
export function mountScrollReveal(scope = document) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (motion.matches || typeof IntersectionObserver === 'undefined') return () => {}
  const selector = '.content-section .section-head, .content-section .section-lead, .content-section .body-copy, .card, .service-folder-card, .steps li, .faq-list details, .request-layout, .footer-grid > *'
  const candidates = Array.from(scope.querySelectorAll(selector))
  const targets = candidates.filter(element => element.getBoundingClientRect().top >= window.innerHeight * .96)
  let stopped = false
  const show = element => {
    element.setAttribute('data-revealed', '')
    observer.unobserve(element)
  }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) show(entry.target)
  }, { rootMargin: '0px 0px -30px 0px', threshold: .08 })
  for (const element of targets) {
    const group = element.parentElement
    const stagger = group && group.matches('.cards, .folder-grid, .steps, .footer-grid')
      ? (Array.from(group.children).indexOf(element) % 3) * 70 : 0
    element.style.setProperty('--reveal-delay', `${stagger}ms`)
    element.setAttribute('data-reveal', '')
    observer.observe(element)
  }
  const focus = event => {
    const element = event.target.closest?.('[data-reveal]')
    if (element) show(element)
  }
  const preferenceChanged = event => {
    if (!event.matches) return
    targets.forEach(show)
    observer.disconnect()
  }
  scope.addEventListener('focusin', focus)
  motion.addEventListener('change', preferenceChanged)
  return () => {
    if (stopped) return
    stopped = true
    observer.disconnect()
    scope.removeEventListener('focusin', focus)
    motion.removeEventListener('change', preferenceChanged)
    for (const element of targets) {
      element.removeAttribute('data-reveal')
      element.removeAttribute('data-revealed')
      element.style.removeProperty('--reveal-delay')
    }
  }
}
