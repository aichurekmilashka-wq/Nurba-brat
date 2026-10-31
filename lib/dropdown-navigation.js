/** Three top-level controls with compact, progressively enhanced disclosure lists. */
export function mountDropdownNavigation(nav) {
  if (!nav) return () => {}
  let mounted = true
  let closeTimer = 0
  const details = Array.from(nav.querySelectorAll('.nav-dropdown'))
  const subgroups = Array.from(nav.querySelectorAll('.nav-subgroup'))
  const closeChildren = item => item.querySelectorAll('.nav-subgroup').forEach(child => { child.open = false })
  const closeAll = except => details.forEach(item => { if (item !== except) { item.open = false; closeChildren(item) } })
  const toggles = details.map(item => {
    const toggle = () => {
      if (item.open) { closeAll(item); document.dispatchEvent(new CustomEvent('nuray:navigation-open', { detail: item })) }
      else closeChildren(item)
    }
    item.addEventListener('toggle', toggle)
    return [item, toggle]
  })
  const childToggles = subgroups.map(item => {
    const toggle = () => { if (item.open) subgroups.forEach(other => { if (other !== item) other.open = false }) }
    item.addEventListener('toggle', toggle)
    return [item, toggle]
  })
  const outside = event => { if (!nav.contains(event.target)) closeAll() }
  const click = event => {
    if (!event.target.closest('a')) return
    // Native navigation must run before its disclosure hides the activated link.
    window.clearTimeout(closeTimer)
    closeTimer = window.setTimeout(() => { if (mounted) closeAll() }, 0)
  }
  const keydown = event => {
    const item = event.target.closest('.nav-dropdown')
    if (!item) return
    const summary = item.querySelector('summary')
    const subgroup = event.target.closest('.nav-subgroup')
    const controls = () => Array.from(item.querySelectorAll('.nav-panel a, .nav-group-trigger')).filter(control => control.getClientRects().length > 0)
    if (event.key === 'Escape' && item.open) {
      event.preventDefault()
      if (subgroup?.open) { subgroup.open = false; subgroup.querySelector('summary').focus() }
      else { item.open = false; summary.focus() }
      return
    }
    if (event.key === 'ArrowRight' && subgroup && event.target === subgroup.querySelector('summary')) {
      event.preventDefault(); subgroup.open = true; subgroup.querySelector('a')?.focus(); return
    }
    if (event.key === 'ArrowLeft' && subgroup?.open) {
      event.preventDefault(); subgroup.open = false; subgroup.querySelector('summary').focus(); return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); closeAll(item); item.open = true
      const links = controls(), index = links.indexOf(document.activeElement)
      const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : links.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length
      links[next]?.focus()
    }
    if ((event.key === 'Home' || event.key === 'End') && item.open && document.activeElement !== summary) {
      event.preventDefault(); const links = controls(); links[event.key === 'Home' ? 0 : links.length - 1]?.focus()
    }
  }
  const focusout = event => {
    // Safari may clear focus while a pointer is activating a link. A null target
    // is not a keyboard exit; outside pointer presses are handled separately.
    if (event.relatedTarget && !nav.contains(event.relatedTarget)) closeAll()
  }
  const sharedOpen = event => closeAll(event.detail)
  document.addEventListener('nuray:navigation-open', sharedOpen)
  document.addEventListener('pointerdown', outside)
  nav.addEventListener('click', click); nav.addEventListener('keydown', keydown); nav.addEventListener('focusout', focusout)
  return () => {
    mounted = false; window.clearTimeout(closeTimer); closeAll()
    ;[...toggles, ...childToggles].forEach(([item, toggle]) => item.removeEventListener('toggle', toggle))
    document.removeEventListener('nuray:navigation-open', sharedOpen); document.removeEventListener('pointerdown', outside)
    nav.removeEventListener('focusout', focusout); nav.removeEventListener('click', click); nav.removeEventListener('keydown', keydown)
  }
}
