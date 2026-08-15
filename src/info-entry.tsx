import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import InfoApp, { type InfoPage } from './InfoApp'
import './styles/index.css'

const root = document.getElementById('root')!
// coach／faq／contact 共用同一支程式，由各 html 的 data-page 指定
const page = (root.dataset.page as InfoPage) || 'faq'

createRoot(root).render(
  <StrictMode>
    <InfoApp page={page} />
  </StrictMode>,
)
