import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CoachProfileApp from './CoachProfileApp'
import './styles/index.css'
import './styles/page-intro.css'
import './styles/coach-profile.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoachProfileApp />
  </StrictMode>,
)
