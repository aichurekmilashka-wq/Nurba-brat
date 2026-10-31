export type SnakePose = { path: string; x: number; y: number; angle: number; offset: number }
export function buildSnakePose(seconds: number, scrollProgress?: number): SnakePose
export function mountSnakeMascot(root: HTMLElement | null): () => void

export function buildScrollTrack(width: number, height: number, progress?: number): { path: string; x: number; y: number; angle: number; progress: number }
