import { initializeTheme } from './lib/theme-toggle'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DemoOne from './demo'
import './styles/globals.css'
import './styles/site.css'
import './styles/brand.css'
import './styles/hero-editorial.css'

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoOne />
  </StrictMode>,
)

import './styles/liquid-glass-button.css'

import './styles/glyph-portal.css'

import './styles/button-7.css'

import './styles/theme.css'

import './styles/action-buttons.css'

import './styles/shifting-dropdown.css'

import './styles/mobile.css'

import './styles/project-journey.css'

import './styles/knowledge.css'
