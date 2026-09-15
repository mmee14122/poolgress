import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CoachesApp from './CoachesApp'
import './styles/index.css'
import './styles/coaches.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoachesApp />
  </StrictMode>,
)
