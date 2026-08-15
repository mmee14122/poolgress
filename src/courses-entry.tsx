import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CoursesApp from './CoursesApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoursesApp />
  </StrictMode>,
)
