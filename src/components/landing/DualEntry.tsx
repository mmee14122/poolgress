import { dualEntry } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * Hero 下方的 PLAY／LEARN Editorial Navigation（2026-09-16 使用者第三版規格）。
 * 架構不變：眉標＋一句主標，下面左右兩張大型 landscape 情境圖（3:2）。
 * 預設：照片乾淨呈現（沒有疊在角落的標籤），圖下才是 editorial 資訊層——
 *   01 — PLAY ／ PLAY WITH APP ／ 一句短敘述。
 * 桌機 hover：照片 scale(1.03)、charcoal 遮罩約 50%、中央淡入「EXPLORE APP ↗」（400ms，由下 12px 上來）。
 * 不加框線、陰影、實心按鈕、位移。手機：上下排，圖上永久保留很淡的底部漸層＋「EXPLORE APP ↗」。
 * 整張圖與圖下文字是同一個 <a>。樣式在 styles/landing-ia.css（.pg-landing-root .pg-dual…）。
 */
export function DualEntry({ on, refCb }: { on: boolean; refCb: (el: HTMLElement | null) => void }) {
  const tiles = [dualEntry.play, dualEntry.learn]
  return (
    <section ref={refCb} id="entry" className="pg-dual" aria-label="PLAY 與 LEARN 兩個入口">
      <div className="pg-dual__inner">
        <header className="pg-dual__head">
          <p className="pg-t-eyebrow" style={fadeUp(on, 0, 0.5, 8)}>{dualEntry.eyebrow}</p>
          <h2 className="pg-dual__title" style={fadeUp(on, 0.08)}>{dualEntry.title}</h2>
        </header>

        <div className="pg-dual__tiles">
          {tiles.map((t, i) => (
            <a
              key={t.no}
              href={t.href}
              className="pg-dual__tile"
              style={fadeUp(on, 0.18 + i * 0.1, 0.9, 20)}
              aria-label={`${t.title}：${t.desc}`}
            >
              <span className="pg-dual__media">
                <img src={t.image} alt="" loading="lazy" />
                <span className="pg-dual__veil" aria-hidden="true" />
                {t.imagePlaceholder && <span className="pg-dual__ph">示意圖・待更換</span>}
                {/* hover（手機常駐）才出現的大型文字 */}
                <span className="pg-dual__hover" aria-hidden="true">
                  {t.hover}
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M8.5 7H17v8.5" />
                  </svg>
                </span>
              </span>

              {/* 圖下 editorial 資訊層 */}
              {/* 圖下 editorial 資訊層（2026-09-16 使用者：編號眉標 01 / THE APP、02 / COACHING（首頁三大入口編號）＋大標＋副標） */}
              <span className="pg-dual__caption">
                <span className="pg-dual__name">{t.title}</span>
                <span className="pg-dual__desc">{t.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
