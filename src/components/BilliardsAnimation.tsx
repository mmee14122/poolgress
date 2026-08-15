/**
 * 俯視球檯動畫：瞄準線 → 假想球 → 母球前進 → 撞擊 → 目標球進袋 → 淡出循環。
 * 純 SVG + CSS keyframes（hero-line1/line2/ghost/obj/cue），無外部資源；
 * prefers-reduced-motion 時動畫類別不啟用，呈現畫好軌跡線的靜態畫面。
 * 原掛在課程頁 Hero，現移至「這堂課怎麼學」區塊上方。
 */
export function BilliardsAnimation() {
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
