import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ComingSoonApp from './ComingSoonApp'
import './styles/index.css'

const root = document.getElementById('root')!
// 頁名由各 html 的 data-page-title 提供，讓三個佔位頁共用同一支程式
const title = root.dataset.pageTitle ?? '敬請期待'

createRoot(root).render(
  <StrictMode>
    <ComingSoonApp title={title} />
  </StrictMode>,
)
