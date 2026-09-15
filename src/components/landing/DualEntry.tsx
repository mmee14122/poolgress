import { dualEntry } from '../../data/landing'
import { fadeUp } from '../../LandingApp'

/**
 * Hero 下方的 PLAY／LEARN 雙入口（2026-09-16 使用者規格）。
 * 目的：前兩屏就讓人知道 Poolgress 現階段有兩條同等重要的入口——App（PLAY）與教練（LEARN）。
 * 不是功能卡片：延續 editorial 排版——眉標、一句主標、左右兩欄大字標籤＋一行說明＋細線 CTA。
 * 桌機兩欄、高度控制在 60–75vh 內；手機上下排。樣式在 styles/landing-ia.css（.pg-landing-root .pg-dual…）。
 */
export function DualEntry({ on, refCb }: { on: boolean; refCb: (el: HTMLElement | null) => void }) {
  const cols = [dualEntry.play, dualEntry.learn]
  return (
    <section ref={refCb} id="entry" className="pg-dual" aria-label="PLAY 與 LEARN 兩個入口">
      <div className="pg-dual__inner">
        <header className="pg-dual__head">
          <p className="pg-t-eyebrow" style={fadeUp(on, 0, 0.5, 8)}>{dualEntry.eyebrow}</p>
          <h2 className="pg-dual__title" style={fadeUp(on, 0.08)}>{dualEntry.title}</h2>
        </header>
        <div className="pg-dual__cols">
          {cols.map((c, i) => (
            <a key={c.label} href={c.cta.href} className="pg-dual__col" style={fadeUp(on, 0.18 + i * 0.1, 0.8, 24)}>
              <p className="pg-dual__label">{c.label}</p>
              <p className="pg-dual__tags">{c.tags}</p>
              <p className="pg-dual__body">{c.body}</p>
              <span className="pg-dual__cta">
                {c.cta.label}
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
