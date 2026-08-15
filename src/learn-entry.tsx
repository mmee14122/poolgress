import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LearnApp from './LearnApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LearnApp />
  </StrictMode>,
)
