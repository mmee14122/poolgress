import { useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { ProfileBooking, formatDuration, formatPrice } from './components/landing/ProfileBooking'
import { coachById, coachLabels, profilePage } from './data/partner-coaches'

/**
 * 教練詳細頁（coach-profile.html?id=coach-a）— 2026-09-16。
 *
 * 桌機：左欄介紹（標頭、課程、球館、理念、經歷）／右欄 sticky 預約面板，預約入口第一屏可見。
 * 手機：標頭 → 「查看可預約時段」按鈕 → 介紹 → 預約面板；底部固定同一顆按鈕，
 *       點了平滑捲到預約區；預約區進入視窗後固定列自動收起，不擋內容。
 *
 * 資料來自 data/partner-coaches.ts（目前是示意資料，畫面標「示意」）。
 * 樣式在 styles/coach-profile.css（.pg-profile-root …），卡片列表與首頁不受影響。
 * id 不存在 → 顯示「找不到這位教練」並連回列表。
 */

const nav = [
  { label: 'App 玩法', href: '/#app' },
  { label: '合作教練', href: './coaches.html' },
  { label: '關於場館', href: '/#space' },
  { label: '聯絡我們', href: '/#contact' },
]

export default function CoachProfileApp() {
  const [coach] = useState(() => coachById(new URLSearchParams(window.location.search).get('id')))

  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  /* 手機底部固定按鈕：預約區在視窗內時收起 */
  const bookingRef = useRef<HTMLDivElement | null>(null)
  const [bookingInView, setBookingInView] = useState(false)
  useEffect(() => {
    const el = bookingRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setBookingInView(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [coach])

  useEffect(() => {
    if (coach) document.title = `${coach.name}｜${coach.focus}｜Poolgress`
  }, [coach])

  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

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
    <div className="pg-profile-root" data-on={on ? '1' : '0'} data-bar={bookingInView ? '0' : '1'}>
      <Navbar links={nav} minimal logoHref="/" />

      <main className="pg-pf">
        <a href="./coaches.html" className="pg-pf-back">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {profilePage.back}
        </a>

        <div className="pg-pf-grid">
          {/* ---------- 左欄：介紹 ---------- */}
          <div className="pg-pf-main">
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
                {/* 手機：標頭下方的預約入口（桌機隱藏，右欄本來就在第一屏） */}
                <button type="button" className="pg-pf-btn pg-pf-head__cta" onClick={scrollToBooking}>
                  {profilePage.mobileCta}
                </button>
              </div>
            </header>

            <div className="pg-pf-details">
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">預約資訊</h2>
              <dl className="pg-pf-services">
                {coach.services.map((s) => (
                  <div key={s.id}>
                    <dt>{s.name}</dt>
                    <dd>
                      {formatDuration(s)} · {formatPrice(s)}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.venues}</h2>
              <ul className="pg-pf-venues">
                {coach.venues.map((v) => (
                  <li key={v.id}>
                    <p className="pg-pf-venues__name">{v.name}</p>
                    <p className="pg-pf-venues__addr">
                      {v.city}・{v.address}
                    </p>
                    {v.mapUrl ? (
                      <a href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="pg-pf-link">
                        {profilePage.mapLink} ↗
                      </a>
                    ) : (
                      <span className="pg-pf-muted">{profilePage.mapPending}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.about}</h2>
              <p className="pg-pf-section__body">{coach.intro}</p>
            </section>
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.philosophy}</h2>
              <p className="pg-pf-quote">{coach.philosophy}</p>
            </section>
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.courses}</h2>
              {coach.courses.length === 0 ? (
                <p className="pg-pf-empty">{profilePage.coursesEmpty}</p>
              ) : (
                <ul className="pg-pf-courses">
                  {coach.courses.map((c) => (
                    <li key={c.title}>
                      <span className="pg-pf-courses__role">{c.role}</span>
                      <a href={c.href}>{c.title}</a>
                    </li>
                  ))}
                </ul>
              )}
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

          {/* ---------- 右欄：預約面板（桌機 sticky） ---------- */}
          <aside className="pg-pf-side">
            <div ref={bookingRef} id="booking" className="pg-pf-side__inner">
              <ProfileBooking coach={coach} />
            </div>
          </aside>
        </div>
      </main>

      {/* 手機底部固定按鈕：預約區在視窗內時收起 */}
      <div className="pg-pf-bar" aria-hidden={bookingInView}>
        <button type="button" className="pg-pf-btn pg-pf-bar__btn" onClick={scrollToBooking} tabIndex={bookingInView ? -1 : 0}>
          {profilePage.mobileCta}
        </button>
      </div>

      <LandingFooter />
    </div>
  )
}
