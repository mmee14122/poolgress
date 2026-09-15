import { appChapter, appHeroImage, appPlayHref, appPreview } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * THE APP 滿版 Hero（2026-09-16）：大幅攝影＋Typography＋留白。
 * 2026-09-16 使用者最終指示：這張 Hero 放在 /app 玩法頁最上方（不再放首頁），
 * 眉標只寫「THE APP」（01／02／03 是首頁三大入口的編號，內頁不用），
 * 圖上：THE GAME／GOES WITH YOU.（白色 serif）＋三行中文；不再有 EXPLORE THE APP CTA、也不是連結（使用者已在 App 頁）。
 * 桌機高 420–520、cover、charcoal 40% 遮罩；文字靠左對齊網站 grid。手機直式 76svh、主標固定兩行。
 * 樣式在 styles/landing-ia.css（.pg-landing-root .pg-app-hero…）。
 */
export function AppHero({
  on,
  refCb,
  eyebrow = appChapter.eyebrow,
  link = false,
}: {
  on: boolean
  refCb: (el: HTMLElement | null) => void
  /** 圖內眉標文字（/app 用「THE APP」） */
  eyebrow?: string
  /** true＝整張是連到 /app 的 <a>，並在角落顯示 EXPLORE THE APP；/app 頁自己用 false */
  link?: boolean
}) {
  const [l1, l2] = appChapter.titleLines
  const inner = (
    <>
      <img src={appHeroImage} alt={appPreview.imageAlt} />
      <span className="pg-app-hero__veil" aria-hidden="true" />
      <span className="pg-app-hero__copy">
        <span id="app" className="pg-anchor-line pg-app-hero__eyebrow">{eyebrow}</span>
        <span className="pg-app-hero__title">
          <span className="pg-app-hero__line">{l1}</span>
          <span className="pg-app-hero__line">
            <span className="pg-app-hero__w1">GOES WITH</span> <span className="pg-app-hero__w2">YOU.</span>
          </span>
        </span>
        <span className="pg-app-hero__body">{appChapter.body}</span>
      </span>
      {link && (
        <span className="pg-app-hero__peek" aria-hidden="true">
          EXPLORE THE APP
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8.5 7H17v8.5" />
          </svg>
        </span>
      )}
    </>
  )
  return (
    <section ref={refCb} id="app-hero" className="pg-app-hero">
      {link ? (
        <a href={appPlayHref} className="pg-app-hero__banner" data-link="1" aria-label={`${l1} ${l2}，探索 App 玩法`} style={fadeUp(on, 0.05, 0.9, 16)}>
          {inner}
        </a>
      ) : (
        <div className="pg-app-hero__banner" data-link="0" style={fadeUp(on, 0.05, 0.9, 16)}>
          {inner}
        </div>
      )}
    </section>
  )
}
