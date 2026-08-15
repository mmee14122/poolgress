import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import VenuesApp from './VenuesApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VenuesApp />
  </StrictMode>,
)
