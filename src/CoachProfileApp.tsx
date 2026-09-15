import { useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { ProfileBooking } from './components/landing/ProfileBooking'
import { coachById, coachLabels, profilePage } from './data/partner-coaches'

/**
 * 教練詳細頁（coach-profile.html?id=coach-a）— 2026-09-16（同日第三版布局，使用者規格）。
 *
 * 閱讀順序：先快速認識教練 → 靠資歷建立信任 → 隨時能進入預約。
 *   頂部：教練摘要（照片、教學方向、姓名、一句說明、專長標籤、適合對象／授課方式）。
 *   下半：左 2/3 主內容（教練介紹 → 經歷與資格 → 教學方式與理念 → 開設／參與的課程），
 *         右 1/3 預約側欄（服務／時長價格／球館選擇＋地址地圖／日期時段／摘要與確認）。
 *   左右各自往下排，不逐列對齊；右欄 sticky 跟著捲。
 * 手機：單欄，摘要 → 介紹 → 資歷 → … → 預約區；底部固定「查看可預約時段」，
 *       預約區進入視窗後自動收起，不擋內容。
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

        {/* ---------- 頂部：教練摘要 ---------- */}
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
            {/* 手機：摘要下方的預約入口（桌機隱藏，右欄本來就看得到） */}
            <button type="button" className="pg-pf-btn pg-pf-head__cta" onClick={scrollToBooking}>
              {profilePage.mobileCta}
            </button>
          </div>
        </header>

        {/* ---------- 下半：左 2/3 主內容 ／ 右 1/3 預約側欄，各自往下排 ---------- */}
        <div className="pg-pf-grid">
          <div className="pg-pf-main">
            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.about}</h2>
              <p className="pg-pf-section__body">{coach.intro}</p>
            </section>

            {/* 經歷與資格：建立信任的內容，放在介紹之後，條列呈現 */}
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

            <section className="pg-pf-section">
              <h2 className="pg-pf-section__title">{S.philosophy}</h2>
              <p className="pg-pf-quote">{coach.philosophy}</p>
              <dl className="pg-pf-facts pg-pf-facts--inline">
                <div>
                  <dt>{coachLabels.format}</dt>
                  <dd>{coach.format}</dd>
                </div>
                <div>
                  <dt>{coachLabels.levels}</dt>
                  <dd>{coach.levels}</dd>
                </div>
              </dl>
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
          </div>

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
