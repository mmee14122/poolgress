import { useEffect, useRef } from 'react'
import { course, courseStats } from '../content/course'
import { products } from '../content/catalog'
import { cart } from '../lib/cart'
import { Button } from '../ui/Button'

const product = products[0]

/**
 * 課程頁 Hero：Sticky Scroll Transition。
 * 左（桌機約 55%）：撞球原理循環動畫；右：課程介紹與 CTA。
 *
 * 外層（.hero-outer）提供捲動距離（桌機 60vh、手機 35vh），
 * Hero 本體 sticky 釘住；進度 --hero-p 直接對應實際捲動：
 *   - 主視覺 scale 1→1.05、亮度微降
 *   - 標題上移 32px；內文與 CTA 淡出
 *   - 下緣長出圓角與陰影；下一區在後段淡入並自然上滑銜接
 * 進度來源：CSS scroll-driven animation；不支援的瀏覽器由此處
 * 的捲動監聽後援（只寫 CSS 變數，不攔截任何輸入事件）。
 */
export function CourseHero() {
  const { hero } = course
  const outerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    // 啟用 scroll timeline 與桌機柔和 snap（僅課程頁生效）
    root.classList.add('course-hero-scroll')

    let cleanup = () => {}
    if (!CSS.supports('animation-timeline: scroll()')) {
      const onScroll = () => {
        const outer = outerRef.current
        const sticky = stickyRef.current
        if (!outer || !sticky) return
        // 桌機距離＝spacer（外層－sticky）；手機無停留，取 45vh 與 CSS 對齊
        const spacer = outer.offsetHeight - sticky.offsetHeight
        const distance = spacer > 0 ? spacer : window.innerHeight * 0.45
        const p = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 1
        root.style.setProperty('--hero-p', p.toFixed(4))
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)
      cleanup = () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)
      }
    }

    return () => {
      cleanup()
      root.classList.remove('course-hero-scroll')
      root.style.removeProperty('--hero-p')
    }
  }, [])

  /**
   * 立即購買：
   * 桌機平滑捲動到右欄固定購買卡；
   * 手機沒有內容流購買卡，直接加入購物車並前往結帳。
   */
  const scrollToBuy = () => {
    if (window.innerWidth >= 1024) {
      document.getElementById('buy-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      cart.add(product)
      location.href = './checkout.html'
    }
  }

  return (
    <section ref={outerRef} className="hero-outer">
      {/* sticky 本體：釘在導覽列下；效果只動 transform/opacity/filter/圓角 */}
      <div ref={stickyRef} className="hero-sticky hero-fx-panel flex items-center bg-[#e4eaf3]">
        <div className="mx-auto grid w-full max-w-[90rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-12 lg:py-14">
        {/* 左：撞球原理動畫（俯視球檯），隨進度微放大、亮度微降 */}
        <div className="hero-fx-media">
          <BilliardsAnimation />
        </div>

        {/* 右：課程介紹 */}
        <div>
          <p className="hero-fx-fade inline-flex rounded-full bg-brand-50 px-3.5 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
            {hero.category}
          </p>

          <h1 className="hero-fx-title mt-4 text-3xl leading-[1.3] sm:text-4xl">{hero.title}</h1>

          <p className="hero-fx-fade mt-4 text-lg font-semibold text-brand-700">{hero.value}</p>

          <p className="hero-fx-fade mt-4 text-sm leading-relaxed text-ink-500 sm:text-base">{hero.intro}</p>

          {/* 課程規模：手機 2×2、桌機同樣兩欄 */}
          <ul className="hero-fx-fade mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-700">
            <li className="flex items-center gap-2">
              <StatIcon d="M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z" />
              共 <strong className="font-semibold text-ink-900">{courseStats.units}</strong>
              個課程單元
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M17 4a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 21a3 3 0 01-2.5-1.4L13.4 17h-2.8l-1.5 2.6A3 3 0 016.6 21a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 4zM9 8H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 100 2.4A1.2 1.2 0 0016 8zm2.5 3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
              <strong className="font-semibold text-ink-900">{courseStats.games}</strong>
              個遊戲闖關
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z" />
              總時數約 <strong className="font-semibold text-ink-900">{courseStats.hours}</strong>
              小時
            </li>
            <li className="flex items-center gap-2">
              <StatIcon d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              適合
              <strong className="font-semibold text-ink-900">{hero.level}</strong>
              的學習者
            </li>
          </ul>

          <div className="hero-fx-fade mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={scrollToBuy} className="w-full sm:w-auto">
              立即購買
            </Button>
            <Button href="#chapters" variant="quiet" size="lg" className="w-full text-brand-700 sm:w-auto">
              查看課程章節
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
              </svg>
            </Button>
          </div>
        </div>
        </div>
      </div>
      {/* 桌機停留距離（60vh）；手機隱藏 */}
      <div className="hero-spacer" aria-hidden="true" />
    </section>
  )
}

function StatIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-brand-600">
      <path d={d} />
    </svg>
  )
}

/**
 * 俯視球檯動畫：瞄準線 → 假想球 → 母球前進 → 撞擊 → 目標球進袋 → 淡出循環。
 * 純 SVG + CSS keyframes，無外部資源；prefers-reduced-motion 時
 * 動畫類別不啟用，呈現畫好軌跡線的靜態畫面。
 */
function BilliardsAnimation() {
  return (
    <div className="overflow-hidden rounded-card shadow-sm">
      <svg viewBox="0 0 720 460" className="block w-full" aria-hidden="true">
        {/* 外框（木邊）與庫邊 */}
        <rect x="0" y="0" width="720" height="460" rx="26" fill="#16294d" />
        <rect x="14" y="14" width="692" height="432" rx="18" fill="#1e4276" />
        {/* 檯面 */}
        <rect x="40" y="40" width="640" height="380" rx="10" fill="#2b66b4" />
        {/* 檯面光澤 */}
        <ellipse cx="360" cy="180" rx="330" ry="150" fill="#387ed9" opacity="0.35" />

        {/* 六個袋口 */}
        {[
          [48, 48], [360, 40], [672, 48],
          [48, 412], [360, 420], [672, 412],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="17" fill="#060d1a" />
        ))}
        {/* 目標袋口微光 */}
        <circle cx="672" cy="48" r="17" fill="none" stroke="rgba(230,196,120,0.5)" strokeWidth="2" />

        {/* 瞄準輔助線：母球 → 撞擊點 */}
        <line
          className="hero-line1"
          x1="200" y1="320" x2="398" y2="235"
          stroke="rgba(251,249,245,0.75)" strokeWidth="2.5"
          strokeDasharray="220" strokeLinecap="round"
        />
        {/* 預測球路：目標球 → 袋口 */}
        <line
          className="hero-line2"
          x1="420" y1="220" x2="672" y2="48"
          stroke="rgba(230,196,120,0.8)" strokeWidth="2.5"
          strokeDasharray="310" strokeLinecap="round"
        />
        {/* 假想球（撞擊點提示） */}
        <circle
          className="hero-ghost"
          cx="398" cy="235" r="13"
          fill="none" stroke="rgba(251,249,245,0.7)" strokeWidth="2" strokeDasharray="4 5"
        />

        {/* 目標球 */}
        <g className="hero-obj">
          <circle cx="420" cy="220" r="13" fill="#d9a441" />
          <circle cx="416" cy="215" r="4" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* 母球 */}
        <g className="hero-cue">
          <circle cx="200" cy="320" r="13" fill="#fbf9f5" />
          <circle cx="196" cy="315" r="4" fill="rgba(255,255,255,0.85)" />
        </g>
      </svg>
    </div>
  )
}
