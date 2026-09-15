import { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { LandingFooter } from './components/LandingFooter'
import { PillarBlock, useLandingReveal, fadeUp, EASE3 } from './LandingApp'
import { appChapter, appPlayPage, landingNav, palette as P, pillarSections } from './data/landing'

/**
 * App 玩法頁（/app，檔名 app-play.html）— 2026-09-16 使用者規格。
 *
 * 首頁只留 App 精簡預覽；原本首頁那整套 App 長敘事搬到這裡，一行程式碼都不重寫：
 *   PillarBlock s02「球桌變成你的關卡」＝ CHALLENGE
 *   → PillarBlock s03「一個人的挑戰，兩個人的遊戲」＝ COMPETE
 *   → PillarBlock s04「下一場，就在這裡」＝ CONNECT
 *   → 收尾 CTA → Footer
 * 圖片、比例、排版、UI overlay、遮罩動畫、RWD 全部沿用 LandingApp 的元件與 landing.css，
 * 只是每段多帶一個敘事標記（01 / CHALLENGE …，走 PillarBlock 既有的 eyebrow 欄位）。
 *
 * Navbar 沿用全站 Navbar（非透明 hero 變體）；導覽連結是絕對路徑，
 * 「合作教練／關於場館／聯絡我們」會回首頁並定位。Logo 回首頁。
 */

const IDS = [...pillarSections.slice(1).map((s) => s.id), 'finale']

export default function AppPlayApp() {
  const { reg, shown, narrow, maskP } = useLandingReveal(IDS)

  useEffect(() => {
    document.title = 'App 玩法｜Poolgress'
  }, [])

  return (
    <main id="top" className="pg-home-root pg-landing-root pg-app-play-root" style={{ background: P.bg, color: P.text }}>
      <Navbar links={landingNav} minimal logoHref="/" />

      {/* 整段沿用首頁原本的 App 長敘事：同一個淡藍底 .pg-app-world。
          「01 / THE APP」章節開場依使用者 2026-09-16 指示移除，直接從 01 / CHALLENGE 開始。 */}
      <div className="pg-app-world">
        {pillarSections.slice(1).map((s, i) => (
          <PillarBlock
            key={s.id}
            s={{ ...s, eyebrow: `0${i + 1} / ${appPlayPage.chapterTags[s.id] ?? s.en}` }}
            flip={i % 2 === 0}
            on={shown(s.id)}
            refCb={reg(s.id)}
            imgRefCb={reg(s.id + '-img')}
            maskProgress={maskP[s.id] ?? 0}
            hideChapterHead
            quick={narrow}
          />
        ))}

        {/* App 介紹影片：與首頁同一個開關（appChapter.video.show），目前關閉 */}
        {appChapter.video.show && appChapter.video.src && (
          <section className="pg-app-video-section site-container">
            <div className="pg-app-video">
              <video className="absolute inset-0 h-full w-full object-cover" src={appChapter.video.src} poster={appChapter.video.poster ?? undefined} controls playsInline preload="none" />
            </div>
          </section>
        )}
      </div>

      {/* 收尾 CTA：CHALLENGE → COMPETE → CONNECT 之後，把人帶回球桌——去找教練，或回首頁 */}
      <section ref={reg('finale')} id="app-finale" className="pg-finale text-center" style={{ background: P.bg, color: P.text }}>
        <div className="site-container">
          <p className="pg-t-manifesto" style={{ color: P.accent, ...fadeUp(shown('finale'), 0, 0.46, 10) }}>
            {appPlayPage.finale.en}
          </p>
          <h2
            className="pg-t-finale-h2 mt-4"
            style={{
              color: P.text,
              opacity: shown('finale') ? 1 : 0,
              transform: shown('finale') ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.6s ${EASE3} 0.1s, transform 0.6s ${EASE3} 0.1s`,
            }}
          >
            {appPlayPage.finale.zh}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {appPlayPage.finale.ctas.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className={`pg-t-cta relative inline-flex w-full max-w-xs items-center justify-center sm:w-auto ${i === 0 ? 'pg-primary-cta' : 'pg-outline-cta'}`}
                style={i === 0 ? { background: P.neutral, color: P.text } : { border: '1px solid var(--button-outline-on-light)', color: P.text }}
              >
                <span className="pg-cta-text relative z-[1]">{c.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  )
}
