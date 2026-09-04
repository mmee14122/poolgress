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
    const ids = ['hero', 'intro01', ...pillarSections.map((s) => s.id), 'finale']
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
        style={{ background: 'linear-gradient(to bottom, rgba(37,42,43,.55), transparent)' }}
      >
        <span className="font-logo text-lg font-semibold tracking-wide" style={{ color: P.bg }}>
          {brand.name}
        </span>
        <a
          href={brand.navCta.href}
          className="inline-flex min-h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors"
          style={{ borderColor: 'rgba(242,239,232,.5)', color: P.bg }}
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
              style={{ borderColor: 'rgba(242,239,232,.18)' }}
            />
            <span className="absolute top-20 left-6 text-xs sm:left-10" style={{ color: 'rgba(242,239,232,.45)' }}>
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(37,42,43,.85), transparent 55%)' }}
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
                  <span aria-hidden="true" style={{ color: 'rgba(242,239,232,.35)' }}>
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
            style={{ background: P.primary, color: P.bg }}
          >
            {hero.cta.label}
          </a>
        </div>
      </section>

      {/* ---------- Hero → 01 Editorial Typography Transition ----------
          Typography first, graphic second：乾淨水平交界，140–220px 呼吸空間，
          先讀到 01 / THE SPACE，再讀到大字標題，最後才進場館圖。
          撞球軌跡是第二層細節：1.5px、13%、走大字右側負空間，不穿過文字。 */}
      <div ref={reg('intro01')} className="relative">
        {/* 軌跡（桌機）：自 Hero 右下越界，收在標題右側負空間 */}
        <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="pointer-events-none absolute inset-x-0 -top-[220px] hidden h-[460px] w-full sm:block"
          aria-hidden="true"
        >
          <path
            d="M 1345 26 C 1230 130, 1130 220, 1050 292 C 985 350, 930 396, 872 428"
            stroke={P.primary}
            strokeWidth="1.5"
            strokeOpacity="0.13"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={shown('intro01') ? 0 : 1}
            style={{ transition: 'stroke-dashoffset 1.1s ease 0.15s' }}
          />
          <circle
            cx="872"
            cy="428"
            r="4"
            fill={P.primary}
            style={{
              opacity: shown('intro01') ? 0.3 : 0,
              transform: shown('intro01') ? 'none' : 'translate(-22px, -12px)',
              transition: 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s',
            }}
          />
        </svg>
        {/* 軌跡（手機）：縮短、只保留局部 */}
        <svg
          viewBox="0 0 375 190"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="pointer-events-none absolute inset-x-0 -top-[95px] h-[190px] w-full sm:hidden"
          aria-hidden="true"
        >
          <path
            d="M 344 16 C 312 62, 282 100, 244 132"
            stroke={P.primary}
            strokeWidth="1.2"
            strokeOpacity="0.13"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={shown('intro01') ? 0 : 1}
            style={{ transition: 'stroke-dashoffset 1s ease 0.15s' }}
          />
          <circle
            cx="244"
            cy="132"
            r="3"
            fill={P.primary}
            style={{
              opacity: shown('intro01') ? 0.3 : 0,
              transform: shown('intro01') ? 'none' : 'translate(-12px, -7px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
            }}
          />
        </svg>

        {/* Typography：eyebrow 左緣約 10vw，大字兩行不對稱排列 */}
        <div className="pt-[88px] pb-4 sm:pt-[176px] sm:pb-8">
          <p
            className="pl-6 text-[11px] font-medium tracking-[0.3em] uppercase sm:pl-[10vw] sm:text-xs"
            style={{
              color: P.primary,
              opacity: shown('intro01') ? 1 : 0,
              transform: shown('intro01') ? 'none' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s',
            }}
          >
            01 / THE SPACE
            <span
              className="ml-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.15em] normal-case"
              style={{ background: P.neutral, color: P.text }}
            >
              COMING SOON
            </span>
          </p>
          <h2
            className="mt-6 pl-6 sm:pl-[10vw]"
            style={{ fontFamily: SERIF, fontWeight: 500, color: P.text }}
          >
            {pillarSections[0].en.split('. ').map((line, i) => (
              <span
                key={line}
                className={`block ${i === 1 ? 'sm:ml-[14vw]' : ''}`}
                style={{
                  fontSize: 'clamp(48px, 7vw, 108px)',
                  lineHeight: 1.0,
                  opacity: shown('intro01') ? 1 : 0,
                  transform: shown('intro01') ? 'none' : 'translateY(30px)',
                  transition: `opacity 0.7s ease ${0.2 + i * 0.15}s, transform 0.7s ease ${0.2 + i * 0.15}s`,
                }}
              >
                {line.endsWith('.') ? line : line + '.'}
              </span>
            ))}
          </h2>
        </div>
      </div>

      {/* ---------- 01–04 價值階梯（奶油白底，隨內容高） ---------- */}
      {pillarSections.map((s, i) => (
        <PillarBlock
          key={s.id}
          s={s}
          flip={i % 2 === 1}
          fadeCls={fade(s.id)}
          refCb={reg(s.id)}
          hideHeading={i === 0}
        />
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
                    ? { background: P.primary, color: P.bg }
                    : { border: '1px solid rgba(242,239,232,.4)', color: P.bg }
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
        style={{ background: P.text, color: 'rgba(242,239,232,.4)' }}
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
  hideHeading = false,
}: {
  s: Pillar
  flip: boolean
  fadeCls: string
  refCb: (el: HTMLElement | null) => void
  /** 編號＋眉標＋標題已在上方轉場區出現時隱藏（僅 01） */
  hideHeading?: boolean
}) {
  return (
    <section ref={refCb} id={s.id} className="scroll-mt-16 px-5 py-16 sm:px-10 lg:py-24">
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-8 lg:items-center lg:gap-14 ${
          flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } ${hideHeading ? fadeCls.replace('translate-y-5', 'translate-y-10') : fadeCls}`}
        style={hideHeading ? { transitionDelay: '0.45s' } : undefined}
      >
        {/* 文字欄 */}
        <div className="lg:w-[38%]">
          {!hideHeading && (<>
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
            style={{ color: P.primary }}
          >
            {s.en}
          </p>
          </>)}
          {!hideHeading && (
          <h2
            className="mt-4 text-3xl leading-snug font-bold sm:text-5xl"
            style={{ fontFamily: SERIF, color: P.text }}
          >
            {s.zh}
          </h2>
          )}
          <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: 'rgba(37,42,43,.78)' }}>
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
              style={{ background: `linear-gradient(135deg, ${P.light}, ${P.secondary})` }}
            >
              <div
                className="absolute inset-[5%] rounded-xl border border-dashed"
                style={{ borderColor: 'rgba(37,42,43,.25)' }}
              />
              <span className="absolute top-3 left-4 text-[11px]" style={{ color: 'rgba(37,42,43,.6)' }}>
                {s.imageHint}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
