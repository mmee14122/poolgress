import { useEffect, useRef, useState } from 'react'
import { brand, finale, hero, pillarSections, type Pillar } from './data/premium-demo'

/**
 * 首頁定案版：四段價值階梯（NAV → HERO → 01–04 → FINAL CTA → FOOTER）。
 *
 * 版面系統照 pool.house 實測：
 * - 米白底 #fbf9f5，深色圖浮在上面（畫廊感）
 * - 標題兩極字級：大標襯線（Noto Serif TC）48–96px vs 內文 16px
 * - 只有 Hero 撐滿一屏，其餘段落隨內容自然高
 * - 大按鈕（高 64px、全圓角）
 * - 唯一動效：進場單向淡入（scroll 事件判定，理由同前：IO/rAF 隱藏分頁不執行）
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
    <main className="bg-ivory-50 text-ink-900">
      {/* ---------- NAV ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b from-black/50 to-transparent px-5 sm:px-10">
        <span className="font-logo text-lg font-semibold tracking-wide text-white">
          {brand.name}
        </span>
        <a
          href={brand.navCta.href}
          className="inline-flex min-h-10 items-center rounded-full border border-white/40 px-5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
        >
          {brand.navCta.label}
        </a>
      </header>

      {/* ---------- HERO：滿屏，8 秒品牌影片（暫空置） ---------- */}
      <section ref={reg('hero')} className="relative flex min-h-svh items-end overflow-hidden bg-brand-950 text-white">
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
          <div className="absolute inset-0 bg-gradient-to-br from-brand-925 to-brand-950">
            <div className="absolute inset-[4%] rounded-2xl border border-dashed border-white/15" />
            <span className="absolute top-20 left-6 text-xs text-white/40 sm:left-10">
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />

        <div className={`relative w-full px-5 pb-16 sm:px-10 sm:pb-20 ${fade('hero')}`}>
          {/* 四字宣言 */}
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-[0.3em] text-brass-300 sm:text-sm">
            {hero.manifesto.map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="text-white/35">→</span>}
                {w}
              </span>
            ))}
          </p>
          <h1
            className="mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
            style={{ fontFamily: SERIF }}
          >
            {hero.title}
          </h1>
          <a
            href={hero.cta.href}
            className="mt-9 inline-flex min-h-16 items-center justify-center rounded-full bg-brand-500 px-10 text-base font-semibold text-white transition-colors hover:bg-brand-600 sm:text-lg"
          >
            {hero.cta.label}
          </a>
        </div>
      </section>

      {/* ---------- 01–04 價值階梯（米白底，隨內容高） ---------- */}
      {pillarSections.map((s, i) => (
        <PillarBlock key={s.id} s={s} flip={i % 2 === 1} fadeCls={fade(s.id)} refCb={reg(s.id)} />
      ))}

      {/* ---------- FINAL CTA：三入口 ---------- */}
      <section
        ref={reg('finale')}
        className="bg-brand-950 px-5 py-24 text-center text-white sm:px-10 lg:py-32"
      >
        <div className={fade('finale')}>
          <p className="text-xs font-medium tracking-[0.3em] text-brass-300 sm:text-sm">
            {finale.en}
          </p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl" style={{ fontFamily: SERIF }}>
            {finale.zh}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {finale.ctas.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className={`inline-flex min-h-16 w-full max-w-xs items-center justify-center rounded-full px-10 text-base font-semibold transition-colors sm:w-auto ${
                  i === 1
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'border border-white/35 text-white hover:border-brass-300 hover:text-brass-300'
                }`}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER（佔位；正式版沿用全站 Footer） ---------- */}
      <footer className="bg-brand-950 px-5 pb-10 text-center text-xs text-white/40 sm:px-10">
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
          <span className="text-sm font-semibold text-brand-500">{s.no}</span>
          <p className="mt-3 text-xs font-medium tracking-[0.25em] text-ink-500 sm:text-sm">
            {s.en}
          </p>
          <h2
            className="mt-4 text-3xl leading-snug font-bold sm:text-5xl"
            style={{ fontFamily: SERIF }}
          >
            {s.zh}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-700">{s.body}</p>
        </div>
        {/* 大圖（深色圖浮在米白紙上） */}
        <div className="relative overflow-hidden rounded-2xl lg:w-[62%]" style={{ aspectRatio: '16/9' }}>
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-925 to-brand-950">
              <div className="absolute inset-[5%] rounded-xl border border-dashed border-white/15" />
              <span className="absolute top-3 left-4 text-[11px] text-white/45">{s.imageHint}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
