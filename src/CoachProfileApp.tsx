import { useCallback, useEffect, useRef, useState } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { ProfileBooking } from './components/landing/ProfileBooking'
import { coachById, coachLabels, profilePage } from './data/partner-coaches'
import { landingNav } from './data/landing'

/**
 * 教練詳細頁（coach-profile.html?id=coach-a）— 2026-09-16。
 *
 * 桌機（≥1024）：左欄介紹（標頭、介紹、經歷與資格）／右欄 sticky 預約面板，維持雙欄。
 * 手機（<1024，2026-09-16 使用者規格：Bottom Sheet）：
 *   頁面只放教練介紹；底部固定「查看可預約時段」→ 預約面板從底部滑出（同一個 <aside>，
 *   CSS 切換成 sheet），在目前頁面上直接選日期。不會在進頁時自動彈出。
 *   開啟：半透明遮罩、鎖住背景捲動（記住捲動位置）、焦點移到關閉鈕；
 *   關閉：關閉鈕／遮罩／Escape，恢復捲動位置、焦點回到開啟按鈕。
 *   預約面板常駐 DOM，重開保留已選資料。
 *
 * 資料來自 data/partner-coaches.ts（目前是示意資料，畫面標「示意」）。
 * 樣式在 styles/coach-profile.css（.pg-profile-root …）。id 不存在 → 「找不到這位教練」。
 */

/* 導覽與首頁共用同一份（2026-09-16：之前這裡寫死 '/#app'，從本頁點「App 玩法」會跳回首頁 THE APP） */
const nav = landingNav

export default function CoachProfileApp() {
  const [coach] = useState(() => coachById(new URLSearchParams(window.location.search).get('id')))
  const [sheetOpen, setSheetOpen] = useState(false)

  const [on, setOn] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (coach) document.title = `${coach.name}｜${coach.focus}｜Poolgress`
  }, [coach])

  /* ── Bottom sheet：開關、背景捲動鎖、焦點管理 ── */
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const scrollYRef = useRef(0)

  const openSheet = () => {
    scrollYRef.current = window.scrollY
    setSheetOpen(true)
  }
  const closeSheet = useCallback(() => setSheetOpen(false), [])

  useEffect(() => {
    const body = document.body
    if (sheetOpen) {
      /* 鎖背景：用 position:fixed 記住捲動位置（iOS 對 overflow:hidden 不可靠） */
      body.style.position = 'fixed'
      body.style.top = `-${scrollYRef.current}px`
      body.style.left = '0'
      body.style.right = '0'
      body.style.width = '100%'
      requestAnimationFrame(() => closeRef.current?.focus())
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeSheet()
      }
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.width = ''
        window.scrollTo(0, scrollYRef.current)
        openerRef.current?.focus()
      }
    }
  }, [sheetOpen, closeSheet])

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
    <div className="pg-profile-root" data-on={on ? '1' : '0'} data-sheet={sheetOpen ? 'open' : 'closed'}>
      <Navbar links={nav} minimal logoHref="/" />

      <main className="pg-pf">
        <a href="./coaches.html" className="pg-pf-back">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          {profilePage.back}
        </a>

        <div className="pg-pf-grid">
          {/* ---------- 左欄／手機主內容：介紹 ---------- */}
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
              </div>
            </header>

            {/* 介紹 → 經歷與資格（建立信任，條列）；理念與課程區塊已依使用者要求移除。 */}
            <div className="pg-pf-details">
              <section className="pg-pf-section">
                <h2 className="pg-pf-section__title">{S.about}</h2>
                <p className="pg-pf-section__body">{coach.intro}</p>
              </section>
              {/* 教學方式（2026-09-16 使用者預留）：教學理念／課程方式／適合學員，資料進來前顯示待補 */}
              <section className="pg-pf-section">
                <h2 className="pg-pf-section__title">{S.method}</h2>
                <p className="pg-pf-empty">{profilePage.methodEmpty}</p>
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

          {/* ---------- 右欄（桌機 sticky）／手機 Bottom Sheet：同一個節點，預約狀態不會因切換遺失 ---------- */}
          <div className="pg-sheet-backdrop" onClick={closeSheet} aria-hidden="true" />
          <aside
            className="pg-pf-side"
            role={sheetOpen ? 'dialog' : undefined}
            aria-modal={sheetOpen ? true : undefined}
            aria-labelledby="sheet-title"
          >
            {/* 手機才顯示的 sheet 標題列 */}
            <div className="pg-sheet__head">
              <div>
                <p id="sheet-title" className="pg-sheet__title">預約教練</p>
                <p className="pg-sheet__coach">{coach.name}</p>
              </div>
              {/* 向下 chevron：語意＝面板往下收起（2026-09-16 使用者）；只有箭頭、觸控範圍 44×44 */}
              <button ref={closeRef} type="button" className="pg-sheet__close" onClick={closeSheet} aria-label="收起預約面板">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <div id="booking" className="pg-pf-side__inner">
              <ProfileBooking coach={coach} />
            </div>
          </aside>
        </div>
      </main>

      {/* 手機底部固定按鈕：開啟 Bottom Sheet；面板開啟時隱藏 */}
      <div className="pg-pf-bar" aria-hidden={sheetOpen}>
        {/* 整條可點；文字右側細線 chevron-up 表示「往上展開」（2026-09-16 使用者） */}
        <button ref={openerRef} type="button" className="pg-pf-btn pg-pf-bar__btn" onClick={openSheet} tabIndex={sheetOpen ? -1 : 0} aria-expanded={sheetOpen}>
          <span>{profilePage.mobileCta}</span>
          <svg className="pg-pf-bar__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
      </div>

      <LandingFooter />
    </div>
  )
}
