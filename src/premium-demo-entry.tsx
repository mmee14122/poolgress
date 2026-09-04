import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PremiumDemoApp from './PremiumDemoApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PremiumDemoApp />
  </StrictMode>,
)
