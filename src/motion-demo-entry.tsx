import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MotionDemoApp from './MotionDemoApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionDemoApp />
  </StrictMode>,
)
