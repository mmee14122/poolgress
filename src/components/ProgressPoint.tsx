/**
 * Progress Point —— Poolgress 的 chapter marker（2026-09-05 取代原本的球路曲線）。
 *
 * 用法：放在章節眉標同一列，例如「01 / THE SPACE ─ ● COMING SOON」。
 * 視覺：Primary 灰藍實心點 9px＋外圈定位環 22px（Primary 12%），
 * 前面可選一條 48px 的 1px 短橫線（<640px 隱藏，375 寬時眉標列才放得下一列）。
 * 無 glow、無 shadow、無 pulse、無曲線。
 *
 * 動態（一次性，順著文字由左而右的 reveal）：
 * 點由左 20px 滑入並淡入（delay 後 0.5s），外圈晚 0.2s 淡入。
 * 顏色與 easing 讀 tokens.css（--pg-primary／--pg-ease-spring）。
 */
const PRIMARY = 'var(--pg-primary)'
const EASE_OUT = 'var(--pg-ease-spring)'

export function ProgressPoint({
  on,
  delay = 0,
  withLine = true,
  className = '',
}: {
  on: boolean
  /** 秒；配合眉標文字 reveal 之後再進場 */
  delay?: number
  /** 前置 1px 短橫線（48px） */
  withLine?: boolean
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-hidden="true">
      {withLine && (
        <span
          className="hidden h-px w-12 origin-left sm:block"
          style={{
            background: PRIMARY,
            opacity: on ? 0.4 : 0,
            transform: on ? 'scaleX(1)' : 'scaleX(0)',
            transition: `opacity 0.4s ${EASE_OUT} ${delay}s, transform 0.5s ${EASE_OUT} ${delay}s`,
          }}
        />
      )}
      <span
        className="relative flex h-[22px] w-[22px] items-center justify-center"
        style={{
          opacity: on ? 1 : 0,
          transform: on ? 'translateX(0)' : 'translateX(-20px)',
          transition: `opacity 0.5s ${EASE_OUT} ${delay + 0.15}s, transform 0.5s ${EASE_OUT} ${delay + 0.15}s`,
        }}
      >
        {/* outer positioning ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(var(--pg-primary-rgb), 0.12)',
            opacity: on ? 1 : 0,
            transition: `opacity 0.4s ${EASE_OUT} ${delay + 0.35}s`,
          }}
        />
        {/* center dot */}
        <span className="relative h-[9px] w-[9px] rounded-full" style={{ background: PRIMARY }} />
      </span>
    </span>
  )
}
