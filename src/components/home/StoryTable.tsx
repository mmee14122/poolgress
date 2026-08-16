/**
 * 舞台球檯：右上角袋口、目標球、母球與兩段瞄準線。
 *
 * 首頁 Hero（S01Hero）以捲動進度 --story-p 驅動 .hs-* 各元素；
 * 關於頁 Hero 則把同一張圖當作靜態品牌視覺使用（不掛捲動動畫）。
 *
 * 幾何座標與 CSS 位移量對應：
 *   母球 (250,470) → 撞擊點 (455,300)：Δ(205,-170)
 *   目標球 (470,285) → 袋口 (620,140)：Δ(150,-145)
 */
export function StoryTable() {
  return (
    <svg
      viewBox="0 0 800 600"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-y-0 right-0 h-full w-full lg:w-[68%]"
    >
      {/* 檯角庫邊 */}
      <path
        d="M120 560 L120 180 Q120 110 190 110 L720 110"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="34"
        strokeLinecap="round"
      />
      {/* 袋口 */}
      <circle cx="620" cy="140" r="34" fill="#060d1a" />
      <circle cx="620" cy="140" r="34" fill="none" stroke="rgba(230,196,120,0.45)" strokeWidth="2.5" />
      {/* 袋口成功微光（進袋後） */}
      <circle className="hs-pocket-glow" cx="620" cy="140" r="46" fill="none" stroke="rgba(144,230,48,0.5)" strokeWidth="3" opacity="0" />

      {/* 瞄準線一段：母球 → 撞擊點 */}
      <line
        className="hs-line1"
        x1="250" y1="470" x2="455" y2="300"
        stroke="rgba(144,230,48,0.85)" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 預測球路：假想球 → 袋口 */}
      <line
        className="hs-line2"
        x1="470" y1="285" x2="620" y2="140"
        stroke="rgba(144,230,48,0.55)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="260"
      />
      {/* 假想球 */}
      <circle
        className="hs-ghost"
        cx="455" cy="300" r="15"
        fill="none" stroke="rgba(251,249,245,0.8)" strokeWidth="2" strokeDasharray="4 5" opacity="0"
      />

      {/* 目標球（進袋主角） */}
      <g className="hs-obj">
        <circle cx="470" cy="285" r="15" fill="#d9a441" />
        <circle cx="465" cy="279" r="4.5" fill="rgba(255,255,255,0.55)" />
      </g>

      {/* 母球（捲動驅動） */}
      <g className="hs-cue">
        <circle cx="250" cy="470" r="15" fill="#fbf9f5" />
        <circle cx="245" cy="464" r="4.5" fill="rgba(255,255,255,0.9)" />
      </g>
    </svg>
  )
}
