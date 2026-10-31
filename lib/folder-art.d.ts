export type ArtPreset = 'aurora' | 'ember' | 'dusk' | 'glacier' | 'verdant'
export type ArtRecipe = { style: 'marble' | 'streak'; colors: string[]; scale?: number; warp?: number; angle?: number; gloss?: number; veins?: number }
export type ArtJob = { width: number; height: number; pixels: Uint8ClampedArray; step: (rows: number) => boolean }
export const ART_PRESETS: Record<ArtPreset, ArtRecipe>
export function hexToRgb(hex: string): [number, number, number]
export function rng(seed: number): () => number
export function hashString(text: string): number
export function createArtJob(width: number, height: number, recipe: ArtRecipe, seed: number): ArtJob
export function fanSlot(index: number, count: number): number
