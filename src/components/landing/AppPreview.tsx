import { appPreview } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * 01 / THE APP 功能摘要（2026-09-16 使用者規格）：接在 AppHero 橫幅下方，
 * 只放 CHALLENGE／COMPETE／CONNECT 三行極簡摘要＋「探索 App 玩法 →」到 /app；
 * 主視覺已移到 AppHero，這裡不再放圖。結束後留 120–160px 大留白進 02 / COACHING。
 * 三段長敘事（球桌變成你的關卡／一個人的挑戰／下一場）整套保留在 AppPlayApp（/app）。
 * 樣式在 styles/landing-ia.css（.pg-landing-root .pg-app-preview…）。
 */
export function AppPreview({ on, refCb }: { on: boolean; refCb?: (el: HTMLElement | null) => void }) {
  return (
    <section ref={refCb} id="app-preview" className="pg-app-preview site-container">
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
