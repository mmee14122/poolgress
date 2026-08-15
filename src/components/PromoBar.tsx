import { useEffect, useState } from 'react'
import { site } from '../content/site'

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
 * 全站頂部限時優惠倒數列（32px，sticky 常駐）。
 * 深藍底 #183D6B、淺金字 #E8C97A；每秒更新，結束後顯示結束訊息。
 * 點擊導向課程頁購買卡；已在課程頁時平滑捲動（桌機至右欄購買卡，
 * 手機捲至內容區讓底部購買列現身）。
 */
export function PromoBar() {
  const { promo } = site
  const [remaining, setRemaining] = useState<Remaining>(() => remainingUntil(promo.endsAt))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(remainingUntil(promo.endsAt))
    }, 1000)
    return () => clearInterval(timer)
  }, [promo.endsAt])

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const buyCard = document.getElementById('buy-card')
    if (!buyCard) return // 不在課程頁：交給預設導頁行為
    e.preventDefault()
    if (window.innerWidth >= 1024) {
      buyCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      // 手機無右欄購買卡：捲到內容區，讓底部固定購買列現身
      document.getElementById('stuck')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a
      href="./course.html#buy-card"
      onClick={onClick}
      className="sticky top-0 z-50 flex h-8 w-full items-center justify-center bg-[#183D6B] px-3 text-[#E8C97A] transition-[filter] duration-150 hover:brightness-110"
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
  )
}
