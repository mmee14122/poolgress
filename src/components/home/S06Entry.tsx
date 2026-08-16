import { home } from '../../data/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 06｜首頁收尾邀請
 *
 * 全寬、低高度（桌機約 400px）的雙欄收尾：左標題敘事、右行動入口。
 * 不用內層卡片與粗邊框；背景是極低對比的球路紋理，不搶文字。
 *
 * 與頁尾的層次：本區用亮一階的 brand-900，頁尾用更深的 brand-950，
 * 交界處以細分隔線＋深色留白過渡，讓「邀請」與「公司資訊」分開讀。
 */
export function S06Entry() {
  const { entry } = home

  return (
    <section id="vision" className="scroll-mt-24 bg-brand-900 text-white">
      <div className="relative isolate overflow-hidden">
        {/* 背景紋理：球路軌跡，透明度極低 */}
        <BackgroundLines />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:min-h-[400px] lg:grid-cols-[57fr_43fr] lg:gap-16 lg:py-20">
          {/* 左：敘事 */}
          <div>
            <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
              {entry.eyebrow}
            </p>
            <h2 className="mt-4 text-2xl leading-snug text-white sm:text-4xl">{entry.title}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {entry.body.join('')}
            </p>
          </div>

          {/* 右：兩個行動入口。桌機直向排列，兩顆等寬好點擊 */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:ml-auto lg:w-full lg:max-w-sm">
            <Button href={entry.cta.href} size="lg" block>
              {entry.cta.label}
            </Button>
            <Button
              href={entry.ctaSecondary.href}
              size="lg"
              variant="quiet"
              block
              /* 減 1px 補回邊框厚度，兩顆按鈕等高 */
              className="border border-white/30 py-[calc(0.875rem-1px)]! text-white! hover:bg-white/10! active:bg-white/15!"
            >
              {entry.ctaSecondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* 與頁尾的過渡：細分隔線＋深色留白 */}
      <div aria-hidden="true" className="h-px w-full bg-white/10" />
      <div aria-hidden="true" className="h-14 w-full bg-brand-950" />
    </section>
  )
}

/** 背景紋理：一條球路與檯邊，極低對比、不可讀性優先 */
function BackgroundLines() {
  return (
    <svg
      viewBox="0 0 1200 400"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
    >
      {/* 檯邊 */}
      <path
        d="M60 360 L60 90 Q60 50 100 50 L1140 50"
        fill="none"
        stroke="#ffffff"
        strokeWidth="26"
        strokeLinecap="round"
      />
      {/* 球路：母球 → 撞擊點 → 袋口 */}
      <line x1="240" y1="320" x2="700" y2="180" stroke="#e6c478" strokeWidth="3" strokeLinecap="round" />
      <line x1="700" y1="180" x2="1040" y2="70" stroke="#e6c478" strokeWidth="3" strokeLinecap="round" strokeDasharray="14 10" />
      <circle cx="240" cy="320" r="16" fill="#ffffff" />
      <circle cx="700" cy="180" r="16" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 5" />
      <circle cx="1040" cy="70" r="26" fill="#000000" />
    </svg>
  )
}
