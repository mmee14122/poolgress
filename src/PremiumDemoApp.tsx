import { useEffect, useRef, useState } from 'react'
import { brand, finale, hero, palette as P, pillarSections, type Pillar } from './data/premium-demo'

/**
 * 首頁定案版：四段價值階梯（NAV → HERO → 01–04 → FINAL CTA → FOOTER）。
 *
 * 進場動畫（2026-08-17 依使用者規格改版）：left-to-right masked reveal。
 * 內容一開始就在最終位置，不飛入、不上浮——用 clip-path: inset(0 100% 0 0)
 * → inset(0 0 0 0) 由左往右「揭開」，僅配極輕的 opacity .85→1 與 translateX -8px→0。
 * 圖片另配極微 scale 1.03→1。easing 用 cubic-bezier(0.25,1,0.5,1)（≈ power4.out）。
 * 文字 0.9s、大標 1.1s、圖片 1.25s；同一區內依閱讀順序 stagger 0.12–0.15s。
 *
 * 觸發：沿用既有 scroll 判定（元素頂緣進入視窗 80% 觸發、單向 once）。
 * 專案無 GSAP/ScrollTrigger，依約不新增 animation library。
 * prefers-reduced-motion：全部直接顯示（revealed 預填）。
 */

const SERIF = "'Noto Serif TC', 'Noto Sans TC', serif"
/** ≈ GSAP power4.out */
const EASE = 'cubic-bezier(0.25, 1, 0.5, 1)'

/** 文字類 reveal：clip 由左而右揭開＋極輕 opacity 與 translateX */
const reveal = (on: boolean, delay: number, dur = 0.9): React.CSSProperties => ({
  clipPath: on ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
  opacity: on ? 1 : 0.85,
  transform: on ? 'translateX(0)' : 'translateX(-8px)',
  transition: `clip-path ${dur}s ${EASE} ${delay}s, opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s`,
  willChange: 'clip-path',
})

/** ≈ GSAP power2.out（02–04 的安靜 fade 用） */
const EASE2 = 'cubic-bezier(0.5, 1, 0.89, 1)'

/** 02–04 文字：極輕的 fade-up（y 20px→0），不是飛入 */
const fadeUp = (on: boolean, delay: number, dur = 0.7): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity ${dur}s ${EASE2} ${delay}s, transform ${dur}s ${EASE2} ${delay}s`,
})

/** 02–04 圖片：只有 opacity，位置與尺寸完全不動 */
const fadeIn = (on: boolean, delay: number, dur = 0.8): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transition: `opacity ${dur}s ${EASE2} ${delay}s`,
})

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
      /* 02–04 提前在視窗 90% 就開始淡入；其餘（hero/轉場/01/結尾）維持 80% */
      const lineFor = (id: string) =>
        window.innerHeight * (id === 's02' || id === 's03' || id === 's04' ? 0.9 : 0.8)
      setRevealed((prev) => {
        let changed = false
        const next = new Set(prev)
        refs.current.forEach((el, id) => {
          if (!next.has(id) && el.getBoundingClientRect().top < lineFor(id)) {
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

  return (
    <main style={{ background: P.bg, color: P.text }}>
      {/* ---------- NAV ---------- */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between px-5 sm:px-10"
        style={{ background: 'linear-gradient(to bottom, rgba(37,44,48,.55), transparent)' }}
      >
        <span className="font-logo text-lg font-semibold tracking-wide" style={{ color: P.bg }}>
          {brand.name}
        </span>
        <a
          href={brand.navCta.href}
          className="inline-flex min-h-10 items-center rounded-full border px-5 text-sm font-semibold transition-colors"
          style={{ borderColor: 'rgba(242,238,230,.5)', color: P.bg }}
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
              style={{ borderColor: 'rgba(242,238,230,.18)' }}
            />
            <span className="absolute top-20 left-6 text-xs sm:left-10" style={{ color: 'rgba(242,238,230,.45)' }}>
              HERO｜8 秒品牌影片佔位（1600×900 循環播放）
            </span>
          </div>
        )}
        {/* 文字可讀性暗角 */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(37,44,48,.85), transparent 55%)' }}
        />

        <div className="relative w-full px-5 pb-16 sm:px-10 sm:pb-20">
          {/* 宣言：eyebrow 先揭開 */}
          <p
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-[0.3em] sm:text-sm"
            style={{ color: P.neutral, ...reveal(shown('hero'), 0, 0.9) }}
          >
            {hero.manifesto.map((w, i) => (
              <span key={w} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" style={{ color: 'rgba(242,238,230,.35)' }}>
                    →
                  </span>
                )}
                {w}
              </span>
            ))}
          </p>
          {/* 主標：line-mask 包一層，內層由左而右揭開 */}
          <div className="overflow-hidden">
            <h1
              className="mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
              style={{ fontFamily: SERIF, color: P.bg, ...reveal(shown('hero'), 0.15, 1.15) }}
            >
              {hero.title}
            </h1>
          </div>
          <a
            href={hero.cta.href}
            className="mt-9 inline-flex min-h-16 items-center justify-center rounded-full px-10 text-base font-semibold hover:opacity-90 sm:text-lg"
            style={{ background: P.neutral, color: P.text, ...reveal(shown('hero'), 0.45, 0.9) }}
          >
            {hero.cta.label}
          </a>
        </div>
      </section>

      {/* ---------- Hero → 01 Editorial Typography Transition ----------
          Typography first, graphic second：乾淨水平交界，140–220px 呼吸空間，
          先讀到 01 / THE SPACE，再讀到大字標題（逐行 mask reveal），最後才進場館圖。
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
            style={{ transition: `stroke-dashoffset 1.1s ${EASE} 0.15s` }}
          />
          <circle
            cx="872"
            cy="428"
            r="4"
            fill={P.primary}
            style={{
              opacity: shown('intro01') ? 0.3 : 0,
              transform: shown('intro01') ? 'none' : 'translate(-22px, -12px)',
              transition: `opacity 0.9s ${EASE} 0.5s, transform 0.9s ${EASE} 0.5s`,
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
            style={{ transition: `stroke-dashoffset 1s ${EASE} 0.15s` }}
          />
          <circle
            cx="244"
            cy="132"
            r="3"
            fill={P.primary}
            style={{
              opacity: shown('intro01') ? 0.3 : 0,
              transform: shown('intro01') ? 'none' : 'translate(-12px, -7px)',
              transition: `opacity 0.8s ${EASE} 0.4s, transform 0.8s ${EASE} 0.4s`,
            }}
          />
        </svg>

        {/* Typography：eyebrow 左緣約 10vw，大字兩行不對稱、逐行 mask reveal */}
        <div className="pt-[88px] pb-4 sm:pt-[176px] sm:pb-8">
          <p
            className="pl-6 text-[11px] font-medium tracking-[0.3em] uppercase sm:pl-[10vw] sm:text-xs"
            style={{ color: P.accent, ...reveal(shown('intro01'), 0, 0.9) }}
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
              /* line-mask：每行獨立 overflow hidden，內層獨立 reveal */
              <span key={line} className={`block overflow-hidden ${i === 1 ? 'sm:ml-[14vw]' : ''}`}>
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(48px, 7vw, 108px)',
                    lineHeight: 1.05,
                    ...reveal(shown('intro01'), 0.12 + i * 0.12, 1.1),
                  }}
                >
                  {line.endsWith('.') ? line : line + '.'}
                </span>
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
          on={shown(s.id)}
          refCb={reg(s.id)}
          hideHeading={i === 0}
        />
      ))}

      {/* ---------- FINAL CTA：三入口 ---------- */}
      <section
        ref={reg('finale')}
        className="px-5 py-24 text-center sm:px-10 lg:py-32"
        style={{ background: P.text, color: P.bg }}
      >
        <p
          className="text-xs font-medium tracking-[0.3em] sm:text-sm"
          style={{ color: P.neutral, ...reveal(shown('finale'), 0, 0.9) }}
        >
          {finale.en}
        </p>
        <div className="overflow-hidden">
          <h2
            className="mt-4 text-3xl font-bold sm:text-5xl"
            style={{ fontFamily: SERIF, color: P.bg, ...reveal(shown('finale'), 0.12, 1.1) }}
          >
            {finale.zh}
          </h2>
        </div>
        <div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={reveal(shown('finale'), 0.3, 0.9)}
        >
          {finale.ctas.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              className="inline-flex min-h-16 w-full max-w-xs items-center justify-center rounded-full px-10 text-base font-semibold transition-opacity hover:opacity-90 sm:w-auto"
              style={
                i === 0
                  ? { background: P.neutral, color: P.text }
                  : { border: '1px solid rgba(242,238,230,.4)', color: P.bg }
              }
            >
              {c.label}
            </a>
          ))}
        </div>
      </section>

      {/* ---------- FOOTER（佔位；正式版沿用全站 Footer） ---------- */}
      <footer
        className="px-5 pb-10 text-center text-xs sm:px-10"
        style={{ background: P.text, color: 'rgba(242,238,230,.4)' }}
      >
        FOOTER｜正式版沿用全站頁尾
      </footer>
    </main>
  )
}

/** 01–04 段：編號＋英文視覺標＋中文主述＋說明＋大圖，左右交錯；
 *  各元素依閱讀順序 left-to-right mask reveal（stagger 0.13s） */
function PillarBlock({
  s,
  flip,
  on,
  refCb,
  hideHeading = false,
}: {
  s: Pillar
  flip: boolean
  on: boolean
  refCb: (el: HTMLElement | null) => void
  /** 編號＋眉標＋標題已在上方轉場區出現時隱藏（僅 01） */
  hideHeading?: boolean
}) {
  /* 01（標題在轉場區）：滿版橫幅＋玻璃卡。圖先揭開、卡片後進（0.35s） */
  if (hideHeading) {
    return (
      <section
        ref={refCb}
        id={s.id}
        className="relative mt-4 w-full overflow-hidden sm:mt-8"
      >
        {/* 場館願景圖不做特效（2026-08-17 使用者指定）：靜態顯示，只有玻璃卡保留 reveal */}
        <div className="relative h-[68svh] min-h-[420px] sm:h-[82svh]">
          {/* 滿版底圖（佔位：灰藍漸層） */}
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}
            >
              <span className="absolute top-4 left-5 text-[11px]" style={{ color: 'rgba(37,44,48,.6)' }}>
                {s.imageHint}（滿版橫幅）
              </span>
            </div>
          )}
          {/* 可讀性漸層：往卡片側加深 */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, transparent 30%, rgba(37,44,48,.35))' }}
          />
          {/* 玻璃卡：桌機置右垂直置中，手機貼底滿寬 */}
          <div
            className="absolute inset-x-4 bottom-5 rounded-2xl p-6 sm:inset-x-auto sm:top-1/2 sm:right-[6%] sm:bottom-auto sm:max-w-xl sm:-translate-y-1/2 sm:p-10"
            style={{
              background: 'rgba(37,44,48,.55)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: P.bg,
              ...fadeUp(on, 0.2, 0.8), /* 玻璃卡改漸層浮出（使用者指定），不再左至右揭開 */
            }}
          >
            <span
              className="rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.15em]"
              style={{ background: P.neutral, color: P.text }}
            >
              {s.badge}
            </span>
            <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(242,238,230,.9)' }}>
              {s.body}
            </p>
          </div>
        </div>
      </section>
    )
  }

  /* 依閱讀順序 stagger 0.06s：label → 標題 → 內文 → 圖 */
  const d = { no: 0, en: 0.06, zh: 0.12, body: 0.18, img: 0.24 }
  return (
    <section ref={refCb} id={s.id} className="scroll-mt-16 px-5 py-10 sm:px-10 lg:py-12">
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-8 lg:items-center lg:gap-14 ${
          flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* 文字欄 */}
        <div className="lg:w-[38%]">
          {!hideHeading && (
            <>
              <span
                className="flex items-center gap-3 text-sm font-bold"
                style={{ color: P.accent, ...fadeUp(on, d.no) }}
              >
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
                style={{ color: P.accent, ...fadeUp(on, d.en) }}
              >
                {s.en}
              </p>
              <div className="overflow-hidden">
                <h2
                  className="mt-4 text-3xl leading-snug font-bold sm:text-5xl"
                  style={{ fontFamily: SERIF, color: P.text, ...fadeUp(on, d.zh) }}
                >
                  {s.zh}
                </h2>
              </div>
            </>
          )}
          <p
            className="mt-5 max-w-md text-base leading-relaxed"
            style={{ color: 'rgba(37,44,48,.78)', ...fadeUp(on, d.body) }}
          >
            {s.body}
          </p>
        </div>
        {/* 大圖：同向揭開＋極微 scale */}
        <div
          className="relative overflow-hidden rounded-2xl lg:w-[62%]"
          style={{ aspectRatio: '16/9', ...fadeIn(on, d.img, 0.8) }}
        >
          {s.image ? (
            <img src={s.image} alt={s.zh} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${P.secondary}, ${P.primary})` }}
            >
              <div
                className="absolute inset-[5%] rounded-xl border border-dashed"
                style={{ borderColor: 'rgba(37,44,48,.25)' }}
              />
              <span className="absolute top-3 left-4 text-[11px]" style={{ color: 'rgba(37,44,48,.6)' }}>
                {s.imageHint}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
