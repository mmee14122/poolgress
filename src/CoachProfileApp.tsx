import { useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { ProfileBooking } from './components/landing/ProfileBooking'
import { coachById, coachLabels, profilePage } from './data/partner-coaches'

/**
 * 教練詳細頁（coach-profile.html?id=coach-a）— 2026-09-16。
 *
 * 桌機（≥1024）：左欄介紹（標頭、介紹、經歷與資格）／右欄 sticky 預約面板，維持雙欄。
 * 手機（<1024，2026-09-16 使用者規格）：
 *   精簡摘要（小頭像＋姓名＋教學方向）→ 「教練介紹／預約課程」頁籤（sticky 在導覽列下）
 *   → 教練介紹：大照片、介紹、經歷與資格
 *   → 預約課程：服務、球館、日曆、時段（不必滑過整篇介紹）
 *   從卡片「查看課程與預約」進來預設開「預約課程」；?tab=about 才開介紹。
 *   底部固定「查看可預約時段」只在介紹頁籤出現，點了切到預約頁籤並定位到頁籤頂。
 *   兩個頁籤都常駐 DOM（CSS 切換顯示），切換不會丟掉已選的服務／球館／日期／時段。
 *
 * 資料來自 data/partner-coaches.ts（目前是示意資料，畫面標「示意」）。
 * 樣式在 styles/coach-profile.css（.pg-profile-root …）。id 不存在 → 「找不到這位教練」。
 */

const nav = [
  { label: 'App 玩法', href: '/#app' },
  { label: '合作教練', href: './coaches.html' },
  { label: '關於場館', href: '/#space' },
  { label: '聯絡我們', href: '/#contact' },
]

type Tab = 'about' | 'booking'

export default function CoachProfileApp() {
  const [coach] = useState(() => coachById(new URLSearchParams(window.location.search).get('id')))
  const [tab, setTab] = useState<Tab>(() =>
    new URLSearchParams(window.location.search).get('tab') === 'about' ? 'about' : 'booking',
  )

  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (coach) document.title = `${coach.name}｜${coach.focus}｜Poolgress`
  }, [coach])

  /* 手機：切到預約頁籤並把頁籤列定位到導覽列正下方（scroll-margin-top 在 CSS） */
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const goBooking = () => {
    setTab('booking')
    requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  if (!coach) {
    return (
      <div className="pg-profile-root" data-on="1">
        <Navbar links={nav} minimal logoHref="/" />
        <main className="pg-pf-notfound">
          <h1 className="pg-pf-notfound__title">{profilePage.notFound.title}</h1>
          <p className="pg-t-body">{profilePage.notFound.body}</p>
          <a href="./coaches.html" className="pg-pf-btn">{profilePage.notFound.cta}</a>
        </main>
        <LandingFooter />
      </div>
    )
  }

  const S = profilePage.sections

  return (
    <div className="pg-profile-root" data-on={on ? '1' : '0'} data-tab={tab}>
      <Navbar links={nav} minimal logoHref="/" />

      <main className="pg-pf">
        <a href="./coaches.html" className="pg-pf-back">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {profilePage.back}
        </a>

        {/* ---------- 手機：精簡摘要（小頭像＋姓名＋教學方向）；桌機隱藏 ---------- */}
        <div className="pg-pf-mini">
          <div className="pg-pf-mini__avatar">
            <img src={coach.photo} alt="" />
          </div>
          <div className="pg-pf-mini__text">
            <p className="pg-pf-mini__name">
              {coach.name}
              {coach.placeholder && <span className="pg-pf-ph">{coachLabels.placeholder}</span>}
            </p>
            <p className="pg-pf-mini__focus">{coach.focus}</p>
          </div>
        </div>

        {/* ---------- 手機：頁籤（sticky 在導覽列下）；桌機隱藏 ---------- */}
        <div ref={tabsRef} className="pg-pf-tabs" role="tablist" aria-label="教練頁內容">
          <button type="button" role="tab" aria-selected={tab === 'about'} className="pg-pf-tab" onClick={() => setTab('about')}>
            教練介紹
          </button>
          <button type="button" role="tab" aria-selected={tab === 'booking'} className="pg-pf-tab" onClick={() => setTab('booking')}>
            預約課程
          </button>
        </div>

        <div className="pg-pf-grid">
          {/* ---------- 左欄／介紹頁籤 ---------- */}
          <div className="pg-pf-main" role="tabpanel" aria-label="教練介紹">
            <header className="pg-pf-head">
              <div className="pg-pf-head__photo">
                <img src={coach.photo} alt={coach.photoAlt} />
                {coach.placeholder && <span className="pg-pf-badge">{coachLabels.placeholderPhoto}</span>}
              </div>
              <div className="pg-pf-head__text">
                <p className="pg-t-eyebrow pg-pf-head__eyebrow">{coach.focus}</p>
                <h1 className="pg-pf-head__name">
                  {coach.name}
                  {coach.placeholder && <span className="pg-pf-ph">{coachLabels.placeholder}</span>}
                </h1>
                <p className="pg-pf-head__pitch">{coach.pitch}</p>
                <ul className="pg-pf-topics" aria-label="教學項目">
                  {coach.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <dl className="pg-pf-facts">
                  <div>
                    <dt>{coachLabels.levels}</dt>
                    <dd>{coach.levels}</dd>
                  </div>
                  <div>
                    <dt>{coachLabels.format}</dt>
                    <dd>{coach.format}</dd>
                  </div>
                  <div>
                    <dt>{coachLabels.venue}</dt>
                    <dd>{coach.venues.map((v) => v.name).join('、') || '待補'}</dd>
                  </div>
                </dl>
              </div>
            </header>

            {/* 左欄資訊列：介紹 → 經歷與資格（建立信任，條列）；理念與課程區塊已依使用者要求移除。 */}
            <div className="pg-pf-details">
              <section className="pg-pf-section">
                <h2 className="pg-pf-section__title">{S.about}</h2>
                <p className="pg-pf-section__body">{coach.intro}</p>
              </section>
              <section className="pg-pf-section">
                <h2 className="pg-pf-section__title">{S.credentials}</h2>
                {coach.credentials.length === 0 ? (
                  <p className="pg-pf-empty">{profilePage.credentialsEmpty}</p>
                ) : (
                  <ul className="pg-pf-credentials">
                    {coach.credentials.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>

          {/* ---------- 右欄／預約頁籤（桌機 sticky） ---------- */}
          <aside className="pg-pf-side" role="tabpanel" aria-label="預約課程">
            <div id="booking" className="pg-pf-side__inner">
              <ProfileBooking coach={coach} />
            </div>
          </aside>
        </div>
      </main>

      {/* 手機底部固定按鈕：只在「教練介紹」頁籤出現，點了切到預約頁籤 */}
      <div className="pg-pf-bar" aria-hidden={tab !== 'about'}>
        <button type="button" className="pg-pf-btn pg-pf-bar__btn" onClick={goBooking} tabIndex={tab === 'about' ? 0 : -1}>
          預約這位教練
        </button>
      </div>

      <LandingFooter />
    </div>
  )
}
