import { useEffect, useRef, useState } from 'react'
import { home } from '../../content/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 01｜Hero：Scroll Story（五幕）
 *
 * 外層 .hs-story 提供捲動距離（spacer 桌機 200vh／手機 140vh），
 * 舞台 sticky 釘住；進度 --story-p 直接對應捲動位置：
 *   SCENE 01 0–18%   品牌主標（載入時一次性淡入）
 *   SCENE 02 18–38%  主標退場、鏡頭推進、瞄準線逐段畫出
 *   SCENE 03 38–62%  母球沿線前進——捲多少走多少，倒捲即倒退
 *   SCENE 04 62–80%  目標球進袋、背景微暗、金句浮現（含極淡成功 glow）
 *   SCENE 05 80–100% 金句上移、副標接棒，sticky 釋放自然銜接下一區
 *
 * 進度來源：CSS scroll-driven animation；不支援時 JS 後援。
 * prefers-reduced-motion：改為靜態 Hero（主標／副標／CTA／靜態球桌）。
 * 網址帶 ?debug 顯示右下角進度徽章（開發用）。
 */
export function S01Hero() {
  const { hero } = home
  const spacerRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [debug, setDebug] = useState<{ p: number; scene: number } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }

    const root = document.documentElement
    root.classList.add('home-hero-scroll')

    let cleanup = () => {}
    if (!CSS.supports('animation-timeline: scroll()')) {
      const onScroll = () => {
        const distance = spacerRef.current?.offsetHeight ?? 0
        const p = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1
        root.style.setProperty('--story-p', p.toFixed(4))
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      cleanup = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }

    // 開發用進度徽章（?debug）
    let debugTimer = 0
    if (new URLSearchParams(location.search).has('debug')) {
      debugTimer = window.setInterval(() => {
        const distance = spacerRef.current?.offsetHeight ?? 1
        const p = Math.min(1, Math.max(0, window.scrollY / distance))
        const scene = p < 0.18 ? 1 : p < 0.38 ? 2 : p < 0.62 ? 3 : p < 0.8 ? 4 : 5
        setDebug({ p, scene })
      }, 150)
    }

    return () => {
      cleanup()
      if (debugTimer) clearInterval(debugTimer)
      root.classList.remove('home-hero-scroll')
      root.style.removeProperty('--story-p')
    }
  }, [])

  if (reduced) return <StaticHero />

  return (
    <section id="hero" className="hs-story relative bg-brand-950">
      {/* 舞台：sticky 釘住，整段故事在此發生 */}
      <div className="hs-stage text-white">
        {/* 背景光暈（載入時輕微縮回） */}
        <div aria-hidden="true" className="hs-enter-bg absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_35%,rgba(56,126,217,0.28),transparent)]" />
        </div>

        {/* 球檯角落與球路（鏡頭推進的主角） */}
        <div className="hs-visual absolute inset-0">
          <StoryTable />
        </div>

        {/* SCENE 04 背景微暗層 */}
        <div aria-hidden="true" className="hs-dim absolute inset-0 bg-black opacity-0" />

        {/* SCENE 01–02：品牌句組 */}
        <div className="hs-headline absolute inset-x-0 top-[16%] px-5 sm:px-8 lg:top-[22%]">
          <div className="hs-enter mx-auto w-full max-w-[68rem]">
            <h1 className="max-w-[36rem] text-[2rem] leading-[1.35] font-bold text-white sm:text-5xl sm:leading-[1.3] lg:text-[3.25rem]">
              {hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 text-lg font-semibold text-brass-300 sm:text-xl">{hero.core}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={hero.cta.href} size="lg">
                {hero.cta.label}
              </Button>
              <Button
                href={hero.ctaSecondary.href}
                size="lg"
                variant="quiet"
                className="text-white transition-colors hover:bg-[#80898E]! hover:text-black! active:bg-[#6f787d]!"
              >
                {hero.ctaSecondary.label}
              </Button>
            </div>
          </div>
        </div>

        {/* SCENE 03 提示句（僅一句） */}
        <p className="hs-hint absolute inset-x-0 bottom-[14%] px-5 text-center text-lg font-semibold text-white/85 opacity-0 sm:text-xl">
          {hero.sceneHint}
        </p>

        {/* SCENE 04 金句 */}
        <div className="absolute inset-x-0 top-[38%] px-5 text-center lg:top-[40%]">
          <p className="hs-quote text-3xl font-bold text-white opacity-0 sm:text-5xl">
            {hero.sceneQuote}
          </p>
          {/* SCENE 05 副標接棒 */}
          <p className="hs-sub mx-auto mt-6 max-w-md text-base leading-relaxed text-white/75 opacity-0 sm:text-lg">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* 捲動距離 */}
      <div ref={spacerRef} className="hs-spacer" aria-hidden="true" />

      {/* 開發用進度徽章（?debug） */}
      {debug && (
        <div className="fixed right-3 bottom-3 z-50 rounded-lg bg-black/80 px-3 py-2 font-mono text-xs text-white tabular-nums">
          progress {debug.p.toFixed(2)} · scene {debug.scene}
        </div>
      )}
    </section>
  )
}

/**
 * 舞台球檯：右上角袋口、目標球、母球與兩段瞄準線。
 * 幾何座標與 CSS 位移量對應：
 *   母球 (250,470) → 撞擊點 (455,300)：Δ(205,-170)
 *   目標球 (470,285) → 袋口 (620,140)：Δ(150,-145)
 */
function StoryTable() {
  return (
    <svg
      viewBox="0 0 800 600"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-y-0 right-0 h-full w-full lg:w-[68%]"
    >
      {/* 檯角庫邊 */}
      <path
        d="M120 560 L120 180 Q120 110 190 110 L720 110"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="34"
        strokeLinecap="round"
      />
      {/* 袋口 */}
      <circle cx="620" cy="140" r="34" fill="#060d1a" />
      <circle cx="620" cy="140" r="34" fill="none" stroke="rgba(230,196,120,0.45)" strokeWidth="2.5" />
      {/* 袋口成功微光（進袋後） */}
      <circle className="hs-pocket-glow" cx="620" cy="140" r="46" fill="none" stroke="rgba(144,230,48,0.5)" strokeWidth="3" opacity="0" />

      {/* 瞄準線一段：母球 → 撞擊點 */}
      <line
        className="hs-line1"
        x1="250" y1="470" x2="455" y2="300"
        stroke="rgba(144,230,48,0.85)" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 預測球路：假想球 → 袋口 */}
      <line
        className="hs-line2"
        x1="470" y1="285" x2="620" y2="140"
        stroke="rgba(144,230,48,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="260"
      />
      {/* 假想球 */}
      <circle
        className="hs-ghost"
        cx="455" cy="300" r="15"
        fill="none" stroke="rgba(251,249,245,0.8)" strokeWidth="2" strokeDasharray="4 5" opacity="0"
      />

      {/* 目標球（進袋主角） */}
      <g className="hs-obj">
        <circle cx="470" cy="285" r="15" fill="#d9a441" />
        <circle cx="465" cy="279" r="4.5" fill="rgba(255,255,255,0.55)" />
      </g>

      {/* 母球（捲動驅動） */}
      <g className="hs-cue">
        <circle cx="250" cy="470" r="15" fill="#fbf9f5" />
        <circle cx="245" cy="464" r="4.5" fill="rgba(255,255,255,0.9)" />
      </g>
    </svg>
  )
}

/** prefers-reduced-motion：靜態 Hero，資訊完整、不播球路動畫 */
function StaticHero() {
  const { hero } = home
  return (
    <section id="hero" className="relative overflow-hidden bg-brand-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_35%,rgba(56,126,217,0.28),transparent)]"
      />
      <div className="relative mx-auto grid w-full max-w-[80rem] gap-12 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <h1 className="text-[2rem] leading-[1.35] font-bold text-white sm:text-5xl sm:leading-[1.3] lg:text-[3.25rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">{hero.subtitle}</p>
          <p className="mt-8 text-lg font-semibold text-brass-300 sm:text-xl">{hero.core}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={hero.cta.href} size="lg">
              {hero.cta.label}
            </Button>
            <Button
              href={hero.ctaSecondary.href}
              size="lg"
              variant="quiet"
              className="text-white transition-colors hover:bg-[#80898E]! hover:text-black! active:bg-[#6f787d]!"
            >
              {hero.ctaSecondary.label}
            </Button>
          </div>
        </div>
        <div className="relative hidden aspect-square lg:block">
          <StoryTable />
        </div>
      </div>
    </section>
  )
}
