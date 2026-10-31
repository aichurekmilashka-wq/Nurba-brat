/** Shared light/dark theme behaviour for React and offline HTML. */
const THEME_KEY = 'nurba-theme';
export function initializeTheme() {
  let theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  try { const stored = localStorage.getItem(THEME_KEY); if (stored === 'light' || stored === 'dark') theme = stored; } catch {}
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
  return theme;
}
export function mountThemeToggle(button, labels = {}) {
  if (!button) return () => {};
  const light = labels.light || 'Дневная тема';
  const dark = labels.dark || 'Ночная тема';
  const update = theme => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    const action = theme === 'dark' ? dark : light;
    button.setAttribute('aria-label', action);
    button.setAttribute('title', action);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    const caption = button.querySelector('.button-7-label');
    if (caption) caption.textContent = action;
  };
  update(initializeTheme());
  const toggle = () => {
    const theme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    update(theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  };
  const storage = event => { if (event.key === THEME_KEY && ['light','dark'].includes(event.newValue)) update(event.newValue); };
  button.addEventListener('click', toggle);
  window.addEventListener('storage', storage);
  return () => { button.removeEventListener('click', toggle); window.removeEventListener('storage', storage); };
}
