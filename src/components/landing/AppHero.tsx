import { appChapter, appPlayHref, appPreview, pillarSections } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * 01 / THE APP 章節 Hero（2026-09-16 使用者規格）：大幅攝影＋Typography＋留白，不是 SaaS 功能區也不是廣告 Banner。
 *
 * 眉標「01 / THE APP」留在橫幅上方（#app 錨點掛在這裡）；
 * 橫幅：THE APP 主視覺（play.webp）近乎 full-bleed、桌機高 420–520、object-fit: cover、charcoal 40% 遮罩；
 * 文字直接疊在圖上、靠左對齊網站 grid：THE GAME／GOES WITH YOU.（白色 serif display）＋三行中文（暖白）。
 * 整張 Hero 是單一 <a> 進 /app：hover 圖 1.02、遮罩加深、右下角低調淡入「EXPLORE THE APP ↗」，400ms；
 * 無框、無陰影、無按鈕。手機：直式 76svh，主標三行，「EXPLORE THE APP ↗」常駐。
 * 樣式在 styles/landing-ia.css（.pg-landing-root .pg-app-hero…）。
 */
export function AppHero({ on, refCb }: { on: boolean; refCb: (el: HTMLElement | null) => void }) {
  const visual = pillarSections.find((s) => s.id === 's02')
  const [l1, l2] = appChapter.titleLines
  return (
    <section ref={refCb} id="app-hero" className="pg-app-hero">
      <div className="pg-app-hero__head site-container">
        <p id="app" className="pg-anchor-line pg-t-eyebrow" style={fadeUp(on, 0, 0.5, 8)}>
          {appChapter.eyebrow}
        </p>
      </div>

      <a href={appPlayHref} className="pg-app-hero__banner" aria-label={`${l1} ${l2}，探索 App 玩法`} style={fadeUp(on, 0.08, 0.9, 16)}>
        {visual?.image && <img src={visual.image} alt={appPreview.imageAlt} />}
        <span className="pg-app-hero__veil" aria-hidden="true" />
        <span className="pg-app-hero__copy">
          <span className="pg-app-hero__title">
            <span className="pg-app-hero__line">{l1}</span>
            {/* 手機：GOES WITH／YOU. 拆成兩行（CSS 控制） */}
            <span className="pg-app-hero__line">
              <span className="pg-app-hero__w1">GOES WITH</span> <span className="pg-app-hero__w2">YOU.</span>
            </span>
          </span>
          <span className="pg-app-hero__body">{appChapter.body}</span>
        </span>
        <span className="pg-app-hero__peek" aria-hidden="true">
          EXPLORE THE APP
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8.5 7H17v8.5" />
          </svg>
        </span>
      </a>
    </section>
  )
}
