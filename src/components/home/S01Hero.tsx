import { useEffect, useRef, useState } from 'react'
import { home } from '../../data/home'
import { Button } from '../../ui/Button'
import { StoryTable } from './StoryTable'

/**
 * SECTION 01｜Hero：Scroll Story（五幕）
 *
 * 桌機：舞台 sticky 釘住，外層 .hs-story 以 spacer 提供 300px 停留距離
 * （Chrome 一格滾輪約 100px，三下滾動完成退場）；
 * 手機：不釘住的普通 Hero，效果在最初 40vh 內完成，一次滑動即見下一區。
 * 進度 --story-p 直接對應捲動位置：
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

    /* 進度距離＝桌機 spacer（25vh）；手機不釘住、無 spacer，取 40vh 與 CSS 對齊 */
    const measure = () =>
      spacerRef.current?.offsetHeight || window.innerHeight * 0.4

    let cleanup = () => {}
    if (!CSS.supports('animation-timeline: scroll()')) {
      /* rAF 節流：每幀最多寫入一次；距離只在 resize 重新量測，
         進度未變（Hero 已離場）即跳過，不做多餘計算 */
      let distance = measure()
      let ticking = false
      let lastP = -1
      const apply = () => {
        ticking = false
        const p = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1
        if (p === lastP) return
        lastP = p
        root.style.setProperty('--story-p', p.toFixed(4))
      }
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(apply)
      }
      const onResize = () => {
        distance = measure()
        onScroll()
      }
      apply()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      cleanup = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }

    // 開發用進度徽章（?debug）
    let debugTimer = 0
    if (new URLSearchParams(location.search).has('debug')) {
      debugTimer = window.setInterval(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / measure()))
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
    <section id="hero" data-nav-dark="#0f1e33" className="hs-story relative bg-brand-950">
      {/* 舞台：sticky 釘住，整段故事在此發生 */}
      <div className="hs-stage text-white">
        {/* 背景光暈（載入時輕微縮回） */}
        <div aria-hidden="true" className="hs-enter-bg pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_60%_35%,rgba(56,126,217,0.28),transparent)]" />
        </div>

        {/* 球檯角落與球路（鏡頭推進的主角） */}
        <div aria-hidden="true" className="hs-visual pointer-events-none absolute inset-0">
          <StoryTable />
        </div>

        {/* SCENE 04 背景微暗層 */}
        <div aria-hidden="true" className="hs-dim pointer-events-none absolute inset-0 bg-black opacity-0" />

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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button href={hero.cta.href} size="lg">
                {hero.cta.label}
              </Button>
              <Button
                href={hero.ctaSecondary.href}
                size="lg"
                variant="quiet"
                className="border border-brass-300 py-[calc(0.875rem-1px)]! text-brass-300! transition-colors hover:bg-brass-300! hover:text-brand-950! active:bg-brass-400!"
              >
                {hero.ctaSecondary.label}
              </Button>
            </div>
          </div>
        </div>

        {/* SCENE 03 提示句（僅一句）。
            pointer-events-none：這些是敘事文字覆蓋層，即使 opacity 為 0 仍會
            疊在 Hero 按鈕上方攔截點擊（手機因畫面較窄特別明顯） */}
        <p className="hs-hint pointer-events-none absolute inset-x-0 bottom-[14%] px-5 text-center text-lg font-semibold text-white/85 opacity-0 sm:text-xl">
          {hero.sceneHint}
        </p>

        {/* SCENE 04 金句 */}
        <div className="pointer-events-none absolute inset-x-0 top-[38%] px-5 text-center lg:top-[40%]">
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

/** prefers-reduced-motion：靜態 Hero，資訊完整、不播球路動畫 */
function StaticHero() {
  const { hero } = home
  return (
    <section id="hero" data-nav-dark="#0f1e33" className="relative overflow-hidden bg-brand-950 text-white">
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
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Button href={hero.cta.href} size="lg">
              {hero.cta.label}
            </Button>
            <Button
              href={hero.ctaSecondary.href}
              size="lg"
              variant="quiet"
              className="border border-brass-300 py-[calc(0.875rem-1px)]! text-brass-300! transition-colors hover:bg-brass-300! hover:text-brand-950! active:bg-brass-400!"
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
