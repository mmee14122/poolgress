import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PurchaseSuccessApp from './PurchaseSuccessApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PurchaseSuccessApp />
  </StrictMode>,
)
