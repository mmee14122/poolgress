import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LandingApp from './LandingApp'
import './styles/index.css'
import './styles/landing.css'
import './styles/coach-card.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingApp />
  </StrictMode>,
)
