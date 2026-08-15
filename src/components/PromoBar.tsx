import { useEffect, useState } from 'react'
import { site } from '../data/site'

type Remaining = { days: number; hours: number; minutes: number; seconds: number } | null

function remainingUntil(target: string): Remaining {
  const diff = new Date(target).getTime() - Date.now()
  if (Number.isNaN(diff) || diff <= 0) return null
  const total = Math.floor(diff / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * 限時優惠倒數列（僅課程頁掛載，32px sticky）。
 * 深藍底 #183D6B、淺金字 #E8C97A；每秒更新，結束後顯示結束訊息。
 * 掛載時在 html 加 has-promo（--promo-h: 2rem），全站 sticky 偏移
 * 以該變數計算；按最右側 X 關閉後變數歸零，版面自動收合。
 */
export function PromoBar() {
  const { promo } = site
  const [dismissed, setDismissed] = useState(false)
  const [remaining, setRemaining] = useState<Remaining>(() => remainingUntil(promo.endsAt))

  // 掛載／關閉時同步 html.has-promo（驅動全站偏移變數）
  useEffect(() => {
    const root = document.documentElement
    if (dismissed) {
      root.classList.remove('has-promo')
      return
    }
    root.classList.add('has-promo')
    return () => root.classList.remove('has-promo')
  }, [dismissed])

  useEffect(() => {
    if (dismissed) return
    const timer = window.setInterval(() => {
      setRemaining(remainingUntil(promo.endsAt))
    }, 1000)
    return () => clearInterval(timer)
  }, [promo.endsAt, dismissed])

  if (dismissed) return null

  const scrollToBuy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const buyCard = document.getElementById('buy-card')
    if (!buyCard) return
    e.preventDefault()
    if (window.innerWidth >= 1024) {
      buyCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      document.getElementById('stuck')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-0 z-50 flex h-8 w-full items-stretch bg-[#183D6B] text-[#E8C97A]">
      {/* 主內容：點擊捲至購買卡 */}
      <a
        href="./course.html#buy-card"
        onClick={scrollToBuy}
        className="flex min-w-0 flex-1 items-center justify-center px-10 transition-[filter] duration-150 hover:brightness-110"
      >
        <p className="flex items-baseline gap-3 truncate text-xs sm:text-sm">
          <span className="font-semibold whitespace-nowrap">{promo.label}</span>
          {remaining ? (
            <>
              <span aria-hidden="true" className="opacity-50">・</span>
              <span className="flex items-baseline gap-1.5 whitespace-nowrap tabular-nums">
                {remaining.days > 0 && (
                  <>
                    <span className="font-semibold">{pad(remaining.days)}</span>
                    <span className="text-[0.85em] opacity-80">天</span>
                  </>
                )}
                <span className="font-semibold">{pad(remaining.hours)}</span>
                <span className="text-[0.85em] opacity-80">時</span>
                <span className="font-semibold">{pad(remaining.minutes)}</span>
                <span className="text-[0.85em] opacity-80">分</span>
                <span className="font-semibold">{pad(remaining.seconds)}</span>
                <span className="text-[0.85em] opacity-80">秒</span>
              </span>
            </>
          ) : (
            <span className="whitespace-nowrap">{promo.endedText}</span>
          )}
        </p>
      </a>

      {/* 最右側：黑色 X 關閉 */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="關閉優惠活動"
        className="flex w-10 shrink-0 items-center justify-center transition-[filter] duration-150 hover:brightness-125"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-black">
          <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
        </svg>
      </button>
    </div>
  )
}
