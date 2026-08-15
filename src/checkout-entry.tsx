import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CheckoutApp from './CheckoutApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CheckoutApp />
  </StrictMode>,
)
