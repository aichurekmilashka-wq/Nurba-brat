"use client"
import { useEffect, useRef } from 'react'
import { Component as Button7 } from '@/components/ui/button-7'
import { mountThemeToggle } from '@/lib/theme-toggle'
import type { Locale } from '@/content/types'

const labels: Record<Locale, { light: string; dark: string }> = {
  ru: { light: 'Дневная тема', dark: 'Ночная тема' },
  ky: { light: 'Күндүзгү тема', dark: 'Түнкү тема' },
  en: { light: 'Day theme', dark: 'Night theme' },
  sv: { light: 'Dagtema', dark: 'Nattema' },
  nb: { light: 'Dagtema', dark: 'Nattema' },
}
export default function ThemeToggle({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => mountThemeToggle(ref.current, labels[locale]), [locale])
  return <Button7 ref={ref} icon="theme" expandedWidth={200} label={labels[locale].light} className="theme-toggle" data-theme-toggle aria-pressed={false} />
}
