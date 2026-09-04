import { Fragment, useEffect, useRef, useState } from 'react'
import {
  appJourney,
  brand,
  finale,
  hero,
  palette as P,
  pillarSections,
  type JourneyStep,
  type Pillar,
} from './data/premium-demo'

/**
 * 首頁定案版：NAV → HERO → 01 THE SPACE → 02 THE APP（章節開場＋PLAY→PROGRESS→TOGETHER）
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

/** ≈ GSAP power3.out（Final CTA 中文標題的落定感） */
const EASE3 = 'cubic-bezier(0.33, 1, 0.68, 1)'

/** ≈ GSAP power2.out（02–04 的安靜 fade 用） */
const EASE2 = 'cubic-bezier(0.5, 1, 0.89, 1)'

/** 02–04 文字：極輕的 fade-up（y 20px→0），不是飛入 */
const fadeUp = (on: boolean, delay: number, dur = 0.7, y = 20): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? 'translateY(0)' : `translateY(${y}px)`,
  transition: `opacity ${dur}s ${EASE2} ${delay}s, transform ${dur}s ${EASE2} ${delay}s`,
})

/** 02 THE APP 三段旅程的 reveal id（PLAY／PROGRESS／TOGETHER） */
const JOURNEY_IDS = appJourney.steps.map((_, i) => `j${i}`)

export default function PremiumDemoApp() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const ids = [
      'hero',
      'intro01',
      'trans02',
      ...pillarSections.map((s) => s.id),
      ...JOURNEY_IDS,
      'finale',
    ]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(new Set(ids))
      return
    }
    const check = () => {
      /* 觸發線：元素頂緣越過視窗高度的這個比例就觸發（單向鎖存） */
      const lineFor = (id: string) =>
        window.innerHeight *
          (id === 'trans02'
            ? 0.85 /* 章節轉場：section 進視窗約 15% 就開始 reveal，不等到畫面中央 */
            : id === 'finale'
              ? 0.92
              : id.startsWith('j')
                ? 0.88 /* 旅程三段：各自進場，元素頂緣過視窗 88% 就淡入 */
                : 0.8)
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
    <main className="pg-home-root" style={{ background: P.bg, color: P.text }}>
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
        className="relative flex items-end overflow-hidden"
        style={{ background: P.text, color: P.bg, minHeight: 'calc(100svh - var(--pg-peek, 56px))' }}
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
          {/* 宣言：由左至右快速連續 reveal——字與箭頭各自 clip 揭開，
              箭頭先畫出、35ms 後帶出下一個字，整串約 0.5s 一氣呵成。
              文字位置不動（無 translateX），完成後全部靜止。 */}
          <p
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-[0.3em] sm:text-sm"
            style={{ color: P.neutral }}
          >
            {hero.manifesto.map((w, i) => {
              /* 與 CTA 填色同一條 master timeline：整串 0–0.75s 完成 */
              const wordDelay = [0, 0.12, 0.27, 0.45][i]
              const arrowDelay = [0, 0.07, 0.2, 0.38][i]
              const mReveal = (delay: number): React.CSSProperties => ({
                clipPath: shown('hero') ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                opacity: shown('hero') ? 1 : 0,
                transition: `clip-path 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
              })
              return (
                <span key={w} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      style={{ color: 'rgba(242,238,230,.35)', ...mReveal(arrowDelay) }}
                    >
                      →
                    </span>
                  )}
                  <span style={mReveal(wordDelay)}>{w}</span>
                </span>
              )
            })}
          </p>
          {/* 主標：line-mask 包一層，內層由左而右揭開 */}
          <div className="overflow-hidden">
            <h1
              className="mt-5 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl lg:text-7xl"
              style={{ fontFamily: SERIF, color: P.bg, ...reveal(shown('hero'), 0.12, 1.15) }}
            >
              {hero.title}
            </h1>
          </div>
          {/* CTA 本體完全靜態：初始只有邊框＋文字，米杏色 fill 隨 Hero 標題節奏
              由左而右灌入（獨立 fill layer 做 clip-path，按鈕本體零位移）。 */}
          <a
            href={hero.cta.href}
            className="pg-hero-cta relative mt-9 inline-flex min-h-16 items-center justify-center overflow-hidden rounded-full border px-10 text-base font-semibold sm:text-lg"
            style={{ background: 'transparent', borderColor: 'rgba(210,194,173,.85)' }}
          >
            {/* fill layer：左→右填滿，停在實心米杏色 */}
            <span
              aria-hidden="true"
              className="pg-cta-fill pointer-events-none absolute inset-0 z-0 rounded-full"
              style={{
                background: P.neutral,
                clipPath: shown('hero') ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                transition:
                  'clip-path 0.76s cubic-bezier(0.22, 1, 0.36, 1) 0.03s, background-color 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            {/* fill 前緣柔光：同步右移，填滿時消失 */}
            {shown('hero') && (
              <span aria-hidden="true" className="pg-cta-fill-edge pointer-events-none absolute z-[1]" />
            )}
            <span
              className="pg-cta-text relative z-[2]"
              style={{
                color: shown('hero') ? P.text : 'rgba(242,238,230,.92)',
                transition: 'color 0.35s ease 0.33s',
              }}
            >
              {hero.cta.label}
            </span>
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
        <div className="pt-[64px] pb-2 sm:pt-[120px] sm:pb-4">
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
              /* 垂直 reveal（2026-08-17 使用者定稿）：line-mask 保留（overflow hidden），
                 內層自下而上浮現——opacity 0→1＋translateY 8px→0（0.52s ease-out），
                 第二行晚 80ms。無 translateX、無水平慣性，完成後完全靜止。 */
              <span
                key={line}
                className={`block overflow-hidden ${i === 1 ? 'sm:ml-[14vw]' : ''}`}
              >
                <span
                  className="block"
                  style={{
                    fontSize: 'clamp(48px, 7vw, 108px)',
                    lineHeight: 1.05,
                    opacity: shown('intro01') ? 1 : 0,
                    transform: shown('intro01') ? 'translateY(0)' : 'translateY(8px)',
                    transition: `opacity 0.52s ${EASE2} ${0.12 + i * 0.08}s, transform 0.52s ${EASE2} ${0.12 + i * 0.08}s`,
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
      {pillarSections.map((s) => (
        <PillarBlock key={s.id} s={s} on={shown(s.id)} refCb={reg(s.id)} />
      ))}

      {/* ---------- 02 THE APP：章節開場＋PLAY → PROGRESS → TOGETHER ---------- */}
      <ChapterTransition on={shown('trans02')} refCb={reg('trans02')} />
      <section id="s02" className="scroll-mt-16 px-5 pb-20 sm:px-10 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          {appJourney.steps.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 && <JourneyLink on={shown(`j${i}`)} indent={JOURNEY_INDENT[i]} />}
              <JourneyBlock
                step={step}
                on={shown(`j${i}`)}
                refCb={reg(`j${i}`)}
                indent={JOURNEY_INDENT[i]}
              />
            </Fragment>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA：三入口 ---------- */}
      <section
        ref={reg('finale')}
        className="px-5 py-14 text-center sm:px-10 lg:py-20"
        style={{ background: P.text, color: P.bg }}
      >
        <p
          className="text-xs font-medium tracking-[0.3em] sm:text-sm"
          style={{ color: P.neutral, ...fadeUp(shown('finale'), 0, 0.46, 10) }}
        >
          {finale.en}
        </p>
        <h2
          className="mt-4 text-3xl font-bold sm:text-5xl"
          style={{
            fontFamily: SERIF,
            color: P.bg,
            opacity: shown('finale') ? 1 : 0,
            transform: shown('finale') ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.6s ${EASE3} 0.1s, transform 0.6s ${EASE3} 0.1s`,
          }}
        >
          {finale.zh}
        </h2>
        {/* 按鈕完全靜態：無任何進場動畫，從頭就鎖在最終位置與樣式 */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {finale.ctas.map((c, i) => (
            <a
              key={c.label}
              href={c.href}
              className={`relative inline-flex min-h-16 w-full max-w-xs items-center justify-center rounded-full px-10 text-base font-semibold sm:w-auto ${
                i === 0 ? 'pg-primary-cta' : 'pg-outline-cta'
              }`}
              style={
                i === 0
                  ? { background: P.neutral, color: P.text }
                  : { border: '2px solid rgba(242,238,230,.55)', color: P.bg }
              }
            >
              {/* outline 按鈕限定：進場後邊框光帶繞一圈（第二顆晚 0.15s） */}
              {i > 0 && shown('finale') && (
                <span
                  aria-hidden="true"
                  className="pg-cta-sweep pointer-events-none absolute inset-0 rounded-full"
                  style={i === 2 ? { animationDelay: '0.6s' } : undefined}
                />
              )}
              <span className="pg-cta-text relative z-[1]">{c.label}</span>
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

/** 使用者指定的 editorial ease（02 THE APP 全段共用） */
const EASE_S = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * 02 THE APP 章節開場（2026-09-05 使用者規格）。
 *
 * 只是從 THE SPACE 過渡到 THE APP 的一次翻頁，不是第二個 Hero：
 * - 高度 36vh（桌機 40vh），落在規格的 35–45vh
 * - 大字 clamp(24px, 3.4vw, 52px)；1440 寬實測 48.96px ≈ 01 大字（100.8px）的 48.6%
 * - 與 01 同一套 serif display、同樣的米白底與 charcoal 字
 * - 眉標 small uppercase sans、字距 0.3em、taupe
 *
 * 動效：眉標 fade+translateY(12px)、大字 fade+translateY(16px)，
 * 0.5s／0.6s、ease cubic-bezier(0.22,1,0.36,1)，第二行晚 80ms。無逐字動畫。
 */
function ChapterTransition({
  on,
  refCb,
}: {
  on: boolean
  refCb: (el: HTMLElement | null) => void
}) {
  return (
    <section
      ref={refCb}
      id="s02-transition"
      className="flex min-h-[36vh] items-center px-5 sm:px-10 lg:min-h-[40vh]"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p
          className="text-[11px] font-medium tracking-[0.3em] uppercase sm:text-xs"
          style={{
            color: P.accent,
            opacity: on ? 1 : 0,
            transform: on ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.5s ${EASE_S}, transform 0.5s ${EASE_S}`,
          }}
        >
          {appJourney.intro.eyebrow}
        </p>
        <h2 className="mt-3 sm:mt-4" style={{ fontFamily: SERIF, fontWeight: 500, color: P.text }}>
          {appJourney.intro.lines.map((t, i) => (
            <span key={t} className={`block overflow-hidden ${i === 1 ? 'sm:ml-[3vw]' : ''}`}>
              <span
                className="block"
                style={{
                  fontSize: 'clamp(24px, 3.4vw, 52px)',
                  lineHeight: 1.08,
                  opacity: on ? 1 : 0,
                  transform: on ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.6s ${EASE_S} ${i * 0.08}s, transform 0.6s ${EASE_S} ${i * 0.08}s`,
                }}
              >
                {t}
              </span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}

/**
 * 三段旅程的桌機左緣縮排（%），讓視線從左上 → 中間 → 右下移動。
 * 區塊寬 62%，34+62=96%，右側仍留白。手機一律 0（CSS 只在 lg 以上套用）。
 */
const JOURNEY_INDENT = ['0%', '17%', '34%']

/**
 * 段與段之間的 directional cue：一條細 taupe 線＋一個小箭頭。
 * 克制到底——只跟著該段一起 fade in，沒有 pulse／glow／gradient／持續動畫。
 * 縮排對齊「下一段」的左緣，視線自然被帶往右下。
 */
function JourneyLink({ on, indent }: { on: boolean; indent: string }) {
  return (
    <div
      aria-hidden="true"
      className="pg-journey-step flex items-center gap-3 py-9 lg:w-[62%] lg:py-11"
      style={
        {
          '--pg-journey-indent': indent,
          opacity: on ? 1 : 0,
          transition: `opacity 0.6s ${EASE_S}`,
        } as React.CSSProperties
      }
    >
      <span className="h-px w-14 lg:w-24" style={{ background: 'rgba(129,107,89,.35)' }} />
      <span className="text-[11px] leading-none" style={{ color: 'rgba(129,107,89,.75)' }}>
        →
      </span>
    </div>
  )
}

/**
 * 旅程的一段（PLAY／PROGRESS／TOGETHER）。
 *
 * 排版：序號＋英文 keyword 同一行 → 中文 serif headline → 一句 description → 大圖。
 * 圖是最大的視覺元素；文字欄最寬 420px，不與圖爭畫面。
 * 桌機用 62% 寬＋遞增縮排做輕微錯位，不是等寬三欄卡片（無框線、無陰影、無 icon）。
 *
 * 動效：整段一起進場，opacity 0→1、translateY 20px→0、0.6s、
 * ease cubic-bezier(0.22,1,0.36,1)；圖片晚 0.1s。無 stagger 逐元素接力。
 */
function JourneyBlock({
  step,
  on,
  refCb,
  indent,
}: {
  step: JourneyStep
  on: boolean
  refCb: (el: HTMLElement | null) => void
  indent: string
}) {
  const rise = (delay: number): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ${EASE_S} ${delay}s, transform 0.6s ${EASE_S} ${delay}s`,
  })
  return (
    <div
      ref={refCb}
      className="pg-journey-step lg:w-[62%]"
      style={{ '--pg-journey-indent': indent } as React.CSSProperties}
    >
      <div style={rise(0)}>
        <p className="flex items-baseline gap-4">
          <span className="text-[11px] tracking-[0.2em]" style={{ color: P.accent }}>
            {step.no}
          </span>
          <span
            className="text-xs font-medium tracking-[0.22em] uppercase sm:text-sm"
            style={{ color: P.text }}
          >
            {step.key}
          </span>
        </p>
        <h3
          className="mt-5"
          style={{
            fontFamily: SERIF,
            fontWeight: 500,
            color: P.text,
            fontSize: 'clamp(28px, 2.6vw, 40px)',
            lineHeight: 1.35,
          }}
        >
          {step.zh}
        </h3>
        <p
          className="mt-4 max-w-[420px] text-[17px]"
          style={{ color: 'rgba(37,44,48,.72)', lineHeight: 1.75 }}
        >
          {step.body}
        </p>
      </div>
      {/* 大圖：整段最大的視覺元素，比文字晚 0.1s 出現 */}
      <div
        className="relative mt-8 overflow-hidden rounded-2xl lg:mt-10"
        style={{ aspectRatio: '3/2', ...rise(0.1) }}
      >
        {step.image ? (
          <img src={step.image} alt={step.zh} className="absolute inset-0 h-full w-full object-cover" />
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
              {step.imageHint}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 01 THE SPACE：滿版場館橫幅＋玻璃卡（編號與大標在上方轉場區已出現）。
 * 2026-09-05 起本頁只剩 01 使用它——舊的 02/03/04 左右交錯版位已由
 * JourneyBlock（PLAY→PROGRESS→TOGETHER）取代，相關死碼一併移除。
 */
function PillarBlock({
  s,
  on,
  refCb,
}: {
  s: Pillar
  on: boolean
  refCb: (el: HTMLElement | null) => void
}) {
  return (
      <section
        ref={refCb}
        id={s.id}
        className="relative mt-2 w-full overflow-hidden sm:mt-5"
      >
        {/* 場館願景圖不做特效（2026-08-17 使用者指定）：靜態顯示，只有玻璃卡保留 reveal */}
        <div
          className="relative min-h-[420px]"
          style={{ height: 'calc(100svh - var(--pg-peek, 56px))' }}
        >
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
