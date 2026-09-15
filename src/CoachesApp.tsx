import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { coaches, coachesPage } from './data/partner-coaches'
import { landingContactEmail } from './data/landing'

/**
 * 合作教練分頁（coaches.html）— 2026-09-16。
 *
 * 承接首頁「03 / THE COACHES」的精簡資訊，這裡放完整介紹：照片、姓名、教學理念、專長、簡介。
 * 設計語言與正式首頁（landing）同一套：Ivory 底、Charcoal 字、Walnut 眉標、serif 600 標題，
 * 精品雜誌式人物頁——照片、字體、留白撐質感，沒有卡片底色／陰影／明顯圓角。
 *
 * 資料全部來自 data/coaches.ts（目前是示意資料，畫面會標示）。
 * 不放預約／付款／購課功能；唯一行動是頁尾「洽談合作」寄信。
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

        {/* 三位教練：桌機三欄等寬、4:5 照片；下方是完整介紹 */}
        <section className="pg-cp-list" aria-label="合作教練介紹">
          {coaches.map((c, i) => (
            <article key={c.id} id={c.id} className="pg-cp-coach" style={{ transitionDelay: `${0.1 + i * 0.08}s` }}>
              <div className="pg-cp-coach__photo">
                <img src={c.photo} alt={c.photoAlt} loading={i === 0 ? 'eager' : 'lazy'} />
                {c.placeholder && <span className="pg-cp-coach__badge">示意照片 · 待更換</span>}
              </div>

              <div className="pg-cp-coach__body">
                <p className="pg-cp-coach__index">0{i + 1}</p>
                <h2 className="pg-cp-coach__name">
                  {c.name}
                  {c.placeholder && <span className="pg-cp-coach__ph">示意資料</span>}
                </h2>
                <p className="pg-cp-coach__tagline">{c.tagline}</p>

                <dl className="pg-cp-coach__facts">
                  <div>
                    <dt>{coachesPage.sectionLabels.philosophy}</dt>
                    <dd className="pg-cp-coach__quote">{c.philosophy}</dd>
                  </div>
                  <div>
                    <dt>{coachesPage.sectionLabels.specialties}</dt>
                    <dd>
                      <ul className="pg-cp-coach__tags">
                        {c.specialties.map((sp) => (
                          <li key={sp}>{sp}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt>{coachesPage.sectionLabels.bio}</dt>
                    <dd>{c.bio}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </section>

        {/* 收尾：只有一個行動——寄信洽談，沒有預約／付款 */}
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
