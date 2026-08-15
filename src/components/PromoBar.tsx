import { site } from '../content/site'
import { useCountdown } from '../hooks/useCountdown'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * 頂部促銷列。刻意壓低視覺重量（窄高度、無大色塊），
 * 避免搶走主內容焦點，也不做那種閃爍倒數的廉價促銷感。
 */
export function PromoBar() {
  const { promo } = site
  const remaining = useCountdown(promo.endsAt)

  // 有設定檔期但已過期 → 整條隱藏
  if (promo.endsAt && !remaining) return null

  const time = remaining
    ? [
        { value: pad(remaining.days), unit: '天' },
        { value: pad(remaining.hours), unit: '時' },
        { value: pad(remaining.minutes), unit: '分' },
      ]
    : [
        { value: '＿＿', unit: '天' },
        { value: '＿＿', unit: '時' },
        { value: '＿＿', unit: '分' },
      ]

  return (
    <div className="bg-felt-950 text-white">
      <div className="mx-auto flex h-9 w-full max-w-[90rem] items-center justify-center gap-x-4 gap-y-1 overflow-hidden px-4 text-sm sm:px-6">
        <p className="flex shrink-0 items-center gap-2">
          <span className="hidden text-white/60 sm:inline">{promo.label}</span>
          <span className="flex items-center gap-1 tabular-nums">
            {time.map((t) => (
              <span key={t.unit} className="flex items-baseline gap-0.5">
                <span className="font-semibold text-brass-300">{t.value}</span>
                <span className="text-xs text-white/60">{t.unit}</span>
              </span>
            ))}
          </span>
        </p>

        <span aria-hidden="true" className="h-3 w-px shrink-0 bg-white/20" />

        <a
          href={promo.linkHref}
          /* 撐滿促銷列高度，讓細窄的公告列上仍有足夠觸控範圍 */
          className="flex h-full shrink-0 items-center truncate text-white/85 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          {promo.linkLabel}
        </a>
      </div>
    </div>
  )
}
