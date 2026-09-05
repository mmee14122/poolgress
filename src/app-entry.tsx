import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppDownloadApp from './AppDownloadApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppDownloadApp />
  </StrictMode>,
)
