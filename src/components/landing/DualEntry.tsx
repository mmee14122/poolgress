import { dualEntry } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * Hero 下方的 PLAY／LEARN 大型 Image Navigation（2026-09-16 使用者第二版規格）。
 * 左右各 50% 的情境大圖就是入口：預設照片是主角，只在左上角留極小的「01 — PLAY」「02 — LEARN」；
 * 桌機 hover：照片 scale(1.03)、charcoal 遮罩漸入約 55%、中央文字由下往上 12px 淡入（約 400ms）。
 * 不加框線、陰影、按鈕變色、卡片位移。手機沒有 hover：保留約 30% 漸層遮罩，標題與 CTA 常駐。
 * 整張圖都可點（單一 <a>），沒有實心 CTA 按鈕。樣式在 styles/landing-ia.css（.pg-landing-root .pg-dual…）。
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
              aria-label={`${t.title}：${t.tags}，${t.cta}`}
            >
              <img src={t.image} alt="" loading="lazy" />
              <span className="pg-dual__veil" aria-hidden="true" />
              {/* 左上角極小導覽提示 */}
              <span className="pg-dual__corner" aria-hidden="true">
                {t.no} — {t.short}
              </span>
              {t.imagePlaceholder && <span className="pg-dual__ph">示意圖・待更換</span>}
              {/* hover（手機常駐）才出現的中央文字 */}
              <span className="pg-dual__text">
                <span className="pg-dual__text-title">{t.title}</span>
                <span className="pg-dual__text-tags">{t.tags}</span>
                <span className="pg-dual__text-cta">
                  {t.cta}
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
