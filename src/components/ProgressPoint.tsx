/**
 * Progress Point —— chapter marker（2026-09-05 v2：使用者指示移除藍點，只在桌機保留細線）。
 * 用法：放在章節眉標同一列，例如「01 / THE SPACE ─ COMING SOON」。
 * 視覺：48px、1px、Primary 40% 的短橫線，≥1024 才顯示；由左向右 scaleX 畫出。
 */
const PRIMARY = 'var(--pg-primary)'
const EASE_OUT = 'var(--pg-ease-spring)'

export function ProgressPoint({
  on,
  delay = 0,
  className = '',
}: {
  on: boolean
  /** 秒；配合眉標文字 reveal 之後再進場 */
  delay?: number
  className?: string
}) {
  return (
    <span
      className={`hidden h-px w-12 origin-left lg:block ${className}`}
      aria-hidden="true"
      style={{
        background: PRIMARY,
        opacity: on ? 0.4 : 0,
        transform: on ? 'scaleX(1)' : 'scaleX(0)',
        transition: `opacity 0.4s ${EASE_OUT} ${delay}s, transform 0.5s ${EASE_OUT} ${delay}s`,
      }}
    />
  )
}
