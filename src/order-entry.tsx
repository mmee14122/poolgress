import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OrderDetailApp from './OrderDetailApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderDetailApp />
  </StrictMode>,
)
