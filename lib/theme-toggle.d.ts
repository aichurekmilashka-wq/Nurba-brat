export function initializeTheme(): 'light' | 'dark'
export function mountThemeToggle(button: HTMLButtonElement | null, labels?: { light?: string; dark?: string }): () => void
