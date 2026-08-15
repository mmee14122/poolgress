import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AccountApp, { type AccountPage } from './AccountApp'
import './styles/index.css'

const root = document.getElementById('root')!
// 三個頁面共用同一支程式，由各 html 的 data-page 指定分頁
const page = (root.dataset.page as AccountPage) || 'profile'

createRoot(root).render(
  <StrictMode>
    <AccountApp page={page} />
  </StrictMode>,
)
