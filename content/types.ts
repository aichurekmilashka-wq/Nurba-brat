export type Locale = 'ru' | 'ky' | 'en' | 'sv' | 'nb'
export type Card = { title: string; text: string; path: string }
export type Block =
  | { type: 'text'; title: string; text: string }
  | { type: 'cards' | 'search'; title: string; text?: string; items: Card[] }
  | { type: 'steps' | 'journey'; title: string; items: string[] }
  | { type: 'checklist'; title: string; text: string; items: string[] }
  | { type: 'faq'; title: string; items: { question: string; answer: string }[] }
  | { type: 'form'; title: string }
export type Page = { title: string; lead: string; blocks: Block[] }
export type SiteData = {
  languages: Record<Locale, string>
  locales: Record<Locale, { ui: Record<string, string>; pages: Record<string, Page> }>
}
