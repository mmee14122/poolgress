import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AboutApp from './AboutApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AboutApp />
  </StrictMode>,
)
