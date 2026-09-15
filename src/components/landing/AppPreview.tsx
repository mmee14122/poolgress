import { appPreview, pillarSections } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * 01 / THE APP 首頁精簡預覽（2026-09-16 使用者規格）。
 * 章節開場（01 / THE APP、THE GAME GOES WITH YOU.、三行體驗文案）沿用 ChapterTransition；
 * 這裡只放：主視覺（沿用 s02「女孩打撞球＋關卡 UI」play.webp，2:1，與長敘事同一個圖框語言）
 * → CHALLENGE／COMPETE／CONNECT 三行極簡摘要 → 「探索 App 玩法 →」到 /app。
 * 三段長敘事（球桌變成你的關卡／一個人的挑戰／下一場）整套保留在 AppPlayApp（/app）。
 * 樣式在 styles/landing-ia.css（.pg-landing-root .pg-app-preview…）。
 */
export function AppPreview({ on, refCb }: { on: boolean; refCb: (el: HTMLElement | null) => void }) {
  const hero = pillarSections.find((s) => s.id === 's02')
  return (
    <section ref={refCb} id="app-preview" className="pg-app-preview site-container">
      <div className="pg-app-preview__media" style={fadeUp(on, 0.05, 0.9, 16)}>
        {hero?.image ? (
          <img src={hero.image} alt={appPreview.imageAlt} loading="lazy" />
        ) : (
          <div className="pg-media-placeholder absolute inset-0" />
        )}
      </div>
      <div className="pg-app-preview__row">
        <ul className="pg-app-preview__items" aria-label="App 核心體驗">
          {appPreview.items.map((it, i) => (
            <li key={it.en} style={fadeUp(on, 0.2 + i * 0.08, 0.7, 14)}>
              <p className="pg-app-preview__en">{it.en}</p>
              <p className="pg-app-preview__zh">{it.zh}</p>
            </li>
          ))}
        </ul>
        <a href={appPreview.cta.href} className="pg-app-preview__cta" style={fadeUp(on, 0.44, 0.6, 10)}>
          <span>{appPreview.cta.label}</span>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  )
}
