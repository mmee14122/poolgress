import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ComicDemoApp from './ComicDemoApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComicDemoApp />
  </StrictMode>,
)
