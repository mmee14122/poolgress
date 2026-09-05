import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BookingApp from './BookingApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BookingApp />
  </StrictMode>,
)
