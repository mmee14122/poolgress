/**
 * Trajectory Line／球路軌跡 —— Poolgress 的品牌 visual motif（2026-09-05 定義）。
 *
 * 不是裝飾線，象徵 Pool → Movement → Progress：
 * 一條極細的球路（Primary 灰藍、35% 透明）由起點慢慢畫到終點，
 * 終點是一顆完整灰藍的球（11px）外加一圈極克制的定位 halo（26px、14%）。
 *
 * 動態（一次性、無 infinite、無 pulse、無 glow）：
 * - on=true 時線 1000ms ease-out 畫出（stroke-dashoffset 1→0）
 * - 線畫完後球＋halo 400ms 淡入，並有一次 scale 0.85→1
 * - prefers-reduced-motion 由呼叫端直接給 on=true，這裡的 transition 仍會跑一次
 *
 * 目前只用在 01 / THE SPACE 的章節開場；未來可少量放在其他 chapter transition，
 * 但不要每區都放，也不要多顆球——90% 安靜、10% 動態。
 */
const PRIMARY = '#6F8FA3'
const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function TrajectoryMotif({
  on,
  viewBox,
  path,
  end,
  className = '',
  strokeWidth = 1.2,
}: {
  /** 章節進入 viewport 後為 true（單向鎖存） */
  on: boolean
  viewBox: string
  /** SVG path d：從起點畫到終點 */
  path: string
  /** 終點座標（viewBox 座標系），球與 halo 畫在這裡 */
  end: { x: number; y: number }
  className?: string
  strokeWidth?: number
}) {
  const ballStyle: React.CSSProperties = {
    opacity: on ? 1 : 0,
    transform: on ? 'scale(1)' : 'scale(0.85)',
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transition: `opacity 0.4s ${EASE_OUT} 0.95s, transform 0.5s ${EASE_OUT} 0.95s`,
  }
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d={path}
        stroke={PRIMARY}
        strokeWidth={strokeWidth}
        strokeOpacity="0.35"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={on ? 0 : 1}
        style={{ transition: `stroke-dashoffset 1s ${EASE_OUT}` }}
      />
      {/* halo：定位感，不是發光 */}
      <circle cx={end.x} cy={end.y} r="13" fill="rgba(111,143,163,0.14)" style={ballStyle} />
      {/* ball：視覺焦點 */}
      <circle cx={end.x} cy={end.y} r="5.5" fill={PRIMARY} style={ballStyle} />
    </svg>
  )
}
