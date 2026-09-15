import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { CoachCard } from './components/landing/CoachCard'
import { coaches, coachesPage } from './data/partner-coaches'
import { landingContactEmail } from './data/landing'

/**
 * 合作教練列表頁（coaches.html）— 2026-09-16 重設計。
 *
 * 與首頁 02 區塊同一組卡片（components/landing/CoachCard）：教學方向、適合對象、
 * 授課方式／地點與「查看課程與預約」按鈕；理念、經歷、預約都在詳細頁 coach-profile.html。
 * 設計語言與正式首頁（landing）同一套：Ivory 底、Charcoal 字、Walnut 眉標、serif 600 標題。
 *
 * 導覽：連結一律用絕對路徑指回正式首頁的錨點（/#space…），
 * 這一頁同時存在於根目錄與 /ui/，用絕對路徑兩邊都對。
 */

const nav = [
  { label: 'App 玩法', href: '/#app' },
  { label: '合作教練', href: './coaches.html' },
  { label: '關於場館', href: '/#space' },
  { label: '聯絡我們', href: '/#contact' },
]

export default function CoachesApp() {
  /* 進場：整頁一次淡入（沒有捲動 reveal，內容短、不需要） */
  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const mailto = `mailto:${landingContactEmail}?subject=${encodeURIComponent('Poolgress 教練合作洽詢')}`

  return (
    <div className="pg-coaches-root" data-on={on ? '1' : '0'}>
      <Navbar links={nav} minimal logoHref="/" />

      <main>
        {/* 開場：眉標／主標／一句說明，左對齊、留白大 */}
        <header className="pg-cp-hero">
          <p className="pg-t-eyebrow">{coachesPage.eyebrow}</p>
          <h1 className="pg-cp-title">{coachesPage.title}</h1>
          <p className="pg-t-body pg-cp-intro">{coachesPage.intro}</p>
        </header>

        {/* 三位教練：桌機三欄等寬；卡片內容與首頁相同 */}
        <section className="pg-cp-list" aria-label="合作教練">
          {coaches.map((c, i) => (
            <div key={c.id} id={c.id} className="pg-cp-item" style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
              <CoachCard coach={c} eager={i === 0} nameFirst />
            </div>
          ))}
        </section>

        {/* 收尾：教練合作洽談 */}
        <section className="pg-cp-closing" id="join">
          <p className="pg-t-manifesto pg-cp-closing__eyebrow">{coachesPage.closing.eyebrow}</p>
          <h2 className="pg-t-finale-h2 pg-cp-closing__title">{coachesPage.closing.title}</h2>
          <p className="pg-t-body pg-cp-closing__body">{coachesPage.closing.body}</p>
          <a href={mailto} className="pg-t-cta pg-primary-cta pg-cp-closing__cta">
            {coachesPage.closing.ctaLabel}
          </a>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
