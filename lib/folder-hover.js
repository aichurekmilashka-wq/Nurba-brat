/** Enable the visible sheets on mouse hover; touch and keyboard keep their controls. */
export function mountFolderHover(root, setOpen) {
  if (!root) return () => {}
  let openedByHover = false
  const enter = event => {
    if (event.pointerType !== 'mouse' || root.hasAttribute('data-open')) return
    openedByHover = true
    setOpen(true)
  }
  const leave = () => {
    if (!openedByHover || root.contains(document.activeElement)) return
    openedByHover = false
    setOpen(false)
  }
  root.addEventListener('pointerenter', enter)
  root.addEventListener('pointerleave', leave)
  return () => {
    root.removeEventListener('pointerenter', enter)
    root.removeEventListener('pointerleave', leave)
  }
}
