import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppPlayApp from './AppPlayApp'
import './styles/index.css'
import './styles/landing.css'
import './styles/landing-ia.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppPlayApp />
  </StrictMode>,
)
