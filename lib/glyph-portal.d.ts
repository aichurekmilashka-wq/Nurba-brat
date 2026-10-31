export type GlyphPortalOptions = { word?: string; focusChar?: string; interactive?: boolean; scrollLength?: number; typographyOnly?: boolean; onProgress?: (progress: number) => void }
export function mountGlyphPortal(section: HTMLElement | null, options?: GlyphPortalOptions): () => void
