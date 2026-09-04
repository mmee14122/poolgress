import { useEffect, useRef, useState } from 'react'
import { brand, finale, hero, palette as P, pillarSections, type Pillar } from './data/premium-demo'

/**
 * 首頁定案版：四段價值階梯（NAV → HERO → 01–04 → FINAL CTA → FOOTER）。
 *
 * 配色（2026-08-17 使用者提供的六色盤，僅此頁）：
 * 奶油白底、深墨文字與深色段落、灰藍主色、橡木棕點綴、暖灰邊框。
 *
 * 版面照 pool.house 實測：標題襯線兩極字級、只有 Hero 滿屏、64px 大按鈕、
 * 唯一動效為進場單向淡入（scroll 事件判定；IO/rAF 隱藏分頁不執行故不用）。
 */

const SERIF = "'Noto Serif TC', 'Noto Sans TC', serif"

export default function PremiumDemoApp() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const ids = ['hero', ...pillarSections.map((s) => s.id), 'finale']
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(new Set(ids))
      return
    }
    const check = () => {
      const line = window.innerHeight * 0.8
      setRevealed((prev) => {
        let changed = false
        const next = new Set(prev)
        refs.current.forEach((el, id) => {
          if (!next.has(id) && el.getBoundingClientRect().top < line) {
            next.add(id)
            changed = true
          }
        })
        return changed ? next : prev
      })
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  const reg = (id: string) => (el: HTMLElement | null) => {
    if (el) refs.current.set(id, el)
  }
  const shown = (id: string) => revealed.has(id)
  const fade = (id: string) =>
    `transition-all duration-700 ease-out ${shown(id) ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`

  return (
    <main style={{ background: P.bg, color: P.text }}>
      {/* ---------- NAV ---------- */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-5 sm:px-10"
        style={{ background: 'linear-gradient(to bottom, rgba(41,48,51,.55), transparent)' }}
      >
        <span className="font-logo text-lg font-semibold tracking-wide" style={{ color: P.bg }}>
          {brand.name}
        </span>
        <a
          href={brand.navCta.href}
          className="inline-flex min-h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors"
          style={{ borderColor: 'rgba(245,242,234,.5)', color: P.bg }}
        >
          {brand.navCta.label}
        </a>
      </header>

      {/* ---------- HERO：滿屏，8 秒品牌影片（暫空置） ---------- */}
      <section
        ref={reg('hero')}
        className="relative flex min-h-svh items-end overflow-hidden"
        style={{ background: P.text, color: P.bg }}
      >
        {hero.video ? (
          <video
            src={hero.video}
            poster={hero.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${P.textSoft}, ${P.text})` }}
          >
            <div
              className="absolute inset-[4%] rounded-2xl border border-dashed"
              style={{ borderColor: 'rgba(245,242,234,.18)' }}
            />
            <span className="absolute top-20 left-6 text-xs sm:left-10" style={{ color: 'rgba(245,242,234,.45)' }}>
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(41,48,51,.85), transparent 55%)' }}
        />

        <div className={`relative w-full px-5 pb-16 sm:px-10 sm:pb-20 ${fade('hero')}`}>
          {/* 四字宣言（橡木棕） */}
          <p
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-[0.3em] sm:text-sm"
            style={{ color: P.accent }}
          >
            {hero.manifesto.map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: 'rgba(245,242,234,.35)' }}>
                    →
                  </span>
                )}
                {w}
              </span>
            ))}
          </p>
          <h1
            className="mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
            style={{ fontFamily: SERIF, color: P.bg }}
          >
            {hero.title}
          </h1>
          <a
            href={hero.cta.href}
            className="mt-9 inline-flex min-h-16 items-center justify-center rounded-full px-10 text-base font-semibold transition-opacity hover:opacity-90 sm:text-lg"
            style={{ background: P.primary, color: P.text }}
          >
            {hero.cta.label}
          </a>
        </div>
      </section>

      {/* ---------- 01–04 價值階梯（奶油白底，隨內容高） ---------- */}
      {pillarSections.map((s, i) => (
        <PillarBlock key={s.id} s={s} flip={i % 2 === 1} fadeCls={fade(s.id)} refCb={reg(s.id)} />
      ))}

      {/* ---------- FINAL CTA：兩入口 ---------- */}
      <section
        ref={reg('finale')}
        className="px-5 py-24 text-center sm:px-10 lg:py-32"
        style={{ background: P.text, color: P.bg }}
      >
        <div className={fade('finale')}>
          <p className="text-xs font-medium tracking-[0.3em] sm:text-sm" style={{ color: P.accent }}>
            {finale.en}
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl" style={{ fontFamily: SERIF, color: P.bg }}>
            {finale.zh}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {finale.ctas.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className="inline-flex min-h-16 w-full max-w-xs items-center justify-center rounded-full px-10 text-base font-semibold transition-opacity hover:opacity-90 sm:w-auto"
                style={
                  i === 0
                    ? { background: P.primary, color: P.text }
                    : { border: '1px solid rgba(245,242,234,.4)', color: P.bg }
                }
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER（佔位；正式版沿用全站 Footer） ---------- */}
      <footer
        className="px-5 pb-10 text-center text-xs sm:px-10"
        style={{ background: P.text, color: 'rgba(245,242,234,.4)' }}
      >
        FOOTER｜正式版沿用全站頁尾
      </footer>
    </main>
  )
}

/** 01–04 段：編號＋英文視覺標＋中文主述＋說明＋大圖，左右交錯 */
function PillarBlock({
  s,
  flip,
  fadeCls,
  refCb,
}: {
  s: Pillar
  flip: boolean
  fadeCls: string
  refCb: (el: HTMLElement | null) => void
}) {
  return (
    <section ref={refCb} id={s.id} className="scroll-mt-16 px-5 py-16 sm:px-10 lg:py-24">
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-8 lg:items-center lg:gap-14 ${
          flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } ${fadeCls}`}
      >
        {/* 文字欄 */}
        <div className="lg:w-[38%]">
          <span className="flex items-center gap-3 text-sm font-bold" style={{ color: P.primary }}>
            {s.no}
            {s.badge && (
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.15em]"
                style={{ background: P.neutral, color: P.text }}
              >
                {s.badge}
              </span>
            )}
          </span>
          <p
            className="mt-3 text-xs font-semibold tracking-[0.25em] sm:text-sm"
            style={{ color: P.accent }}
          >
            {s.en}
          </p>
          <h2
            className="mt-4 text-3xl leading-snug font-bold sm:text-5xl"
            style={{ fontFamily: SERIF, color: P.text }}
          >
            {s.zh}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: 'rgba(41,48,51,.78)' }}>
            {s.body}
          </p>
        </div>
        {/* 大圖（深色圖浮在奶油白紙上；佔位用灰藍面） */}
        <div className="relative overflow-hidden rounded-2xl lg:w-[62%]" style={{ aspectRatio: '16/9' }}>
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}
            >
              <div
                className="absolute inset-[5%] rounded-xl border border-dashed"
                style={{ borderColor: 'rgba(41,48,51,.25)' }}
              />
              <span className="absolute top-3 left-4 text-[11px]" style={{ color: 'rgba(41,48,51,.6)' }}>
                {s.imageHint}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
