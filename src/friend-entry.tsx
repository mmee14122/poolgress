import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FriendProfileApp from './FriendProfileApp'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FriendProfileApp />
  </StrictMode>,
)
