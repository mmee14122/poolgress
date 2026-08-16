/**
 * Poolgress 微型狀態插圖系統。
 *
 * 一套共用的極簡俯視球桌語言：同樣的線條粗細（1.5–2）、圓角、袋口與球徑，
 * 只用 1–2 顆球。失敗不是挫敗，是「差一點，調整角度再來一次」。
 *
 * 用法：<StatusIllustration status="failed" />
 * 動畫：只播一次、800–1200ms；prefers-reduced-motion 時全部靜止（見 index.css）。
 * 顏色一律走品牌變數，不用滿版紅。
 */

export type IllustrationStatus =
  | 'failed' // 差一點進球
  | 'pending' // 正在確認這一桿的結果
  | 'already-paid' // 這一球已經進了
  | 'owned' // 這門課已經在你的球袋裡
  | 'provisioning' // 正在替你開通球桌
  | 'offline' // 球路暫時中斷了
  | 'empty-cart' // 球桌還在等第一球
  | 'coupon-expired' // 優惠券過了出桿時間
  | 'unavailable' // 這張球桌暫時收起來了
  | 'timeout' // 這一局暫停了一下

/* 共用色：深藍檯邊、象牙白母球、淡金強調、低飽和磚紅提示 */
const RAIL = 'var(--color-brand-900, #16294d)'
const CLOTH = 'var(--color-brand-50, #eef4fc)'
const CUE = '#FBF9F5'
const GOLD = '#D9A441'
const CLAY = '#B5645A'
const AQUA = '#5B9E8F'
const BLUE = '#4A7FC1'

type Props = {
  status: IllustrationStatus
  className?: string
}

export function StatusIllustration({ status, className = '' }: Props) {
  return (
    <div className={`pg-illus mx-auto w-[112px] sm:w-[128px] ${className}`} aria-hidden="true">
      <svg viewBox="0 0 128 96" className="h-auto w-full">
        <Scene status={status} />
      </svg>
    </div>
  )
}

/** 檯角：左上袋口＋兩段庫邊，所有狀態共用同一組幾何 */
function Rail({ pocket = true }: { pocket?: boolean }) {
  return (
    <>
      <rect x="6" y="6" width="116" height="84" rx="14" fill={CLOTH} />
      <path
        d="M14 84 V22 Q14 14 22 14 H114"
        fill="none"
        stroke={RAIL}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      {pocket && (
        <>
          <circle cx="104" cy="26" r="11" fill={RAIL} opacity="0.9" />
          <circle cx="104" cy="26" r="11" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.5" />
        </>
      )}
    </>
  )
}

function Scene({ status }: { status: IllustrationStatus }) {
  switch (status) {
    /* 差一點進球：目標球停在袋口邊、球路微微偏掉 */
    case 'failed':
      return (
        <>
          <Rail />
          <path
            className="pg-illus-path"
            d="M34 70 Q66 54 92 40"
            fill="none"
            stroke={CLAY}
            strokeWidth="1.5"
            strokeDasharray="3 4"
            strokeLinecap="round"
            opacity="0.75"
          />
          <circle className="pg-illus-ball" cx="34" cy="70" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <circle className="pg-illus-ball-2" cx="92" cy="40" r="8" fill={GOLD} />
          <circle cx="89" cy="37" r="2.4" fill="#fff" opacity="0.55" />
        </>
      )

    /* 確認中：母球緩慢滾動，落點以細點閃爍 */
    case 'pending':
      return (
        <>
          <Rail />
          <path d="M30 68 Q62 56 96 34" fill="none" stroke={BLUE} strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" opacity="0.6" />
          <circle className="pg-illus-roll" cx="30" cy="68" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <circle className="pg-illus-blink" cx="104" cy="26" r="3.5" fill={BLUE} />
        </>
      )

    /* 已付款：球安靜落袋，袋口小勾勾 */
    case 'already-paid':
      return (
        <>
          <Rail />
          <path d="M30 70 Q64 52 96 32" fill="none" stroke={AQUA} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.5" />
          <circle cx="30" cy="70" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <path
            className="pg-illus-check"
            d="M99 26 l3.5 3.5 L110 22"
            fill="none"
            stroke={AQUA}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )

    /* 已擁有課程：球入袋，旁邊一張極簡課程卡 */
    case 'owned':
      return (
        <>
          <Rail />
          <rect x="24" y="46" width="46" height="32" rx="6" fill="#fff" stroke={RAIL} strokeWidth="1.5" opacity="0.9" />
          <path d="M31 56 h26 M31 63 h20 M31 70 h14" stroke={RAIL} strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
          <path
            className="pg-illus-check"
            d="M99 26 l3.5 3.5 L110 22"
            fill="none"
            stroke={AQUA}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )

    /* 開通中：球自袋口落下，底部一條細 loading 軌跡 */
    case 'provisioning':
      return (
        <>
          <Rail />
          <circle className="pg-illus-drop" cx="104" cy="26" r="7" fill={GOLD} />
          <rect x="26" y="72" width="76" height="4" rx="2" fill={RAIL} opacity="0.15" />
          <rect className="pg-illus-track" x="26" y="72" width="34" height="4" rx="2" fill={BLUE} />
        </>
      )

    /* 網路中斷：球路虛線中途斷開，末端小訊號符號 */
    case 'offline':
      return (
        <>
          <Rail pocket={false} />
          <path d="M28 70 Q46 62 58 56" fill="none" stroke={CLAY} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" />
          <path d="M76 46 Q86 41 94 38" fill="none" stroke={CLAY} strokeWidth="1.5" strokeDasharray="3 4" strokeLinecap="round" opacity="0.4" />
          <circle cx="28" cy="70" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <g stroke={CLAY} strokeWidth="1.8" fill="none" strokeLinecap="round">
            <path d="M98 34 q5 -5 10 0" opacity="0.5" />
            <path d="M101 38 q3.5 -3.5 7 0" opacity="0.75" />
          </g>
          <circle cx="104.5" cy="42" r="1.8" fill={CLAY} />
        </>
      )

    /* 空購物車：空的球桌角落，一顆小球與淡淡球桿線 */
    case 'empty-cart':
      return (
        <>
          <Rail pocket={false} />
          <path d="M22 82 L64 52" stroke={RAIL} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
          <circle cx="76" cy="46" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
        </>
      )

    /* 優惠碼失效：小票券像計分牌翻到 expired */
    case 'coupon-expired':
      return (
        <>
          <Rail pocket={false} />
          <g transform="rotate(-6 64 48)">
            <rect x="30" y="32" width="68" height="34" rx="6" fill="#fff" stroke={RAIL} strokeWidth="1.5" />
            <path d="M30 49 h68" stroke={RAIL} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
            <path d="M40 40 h22" stroke={CLAY} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M40 58 h34" stroke={RAIL} strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
          </g>
          <circle cx="100" cy="74" r="6.5" fill={GOLD} opacity="0.9" />
        </>
      )

    /* 課程下架：球桌覆上半透明桌布，球留在邊角 */
    case 'unavailable':
      return (
        <>
          <Rail pocket={false} />
          <circle cx="34" cy="72" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <path
            d="M6 34 Q34 26 64 34 T122 34 V76 Q122 90 108 90 H20 Q6 90 6 76 Z"
            fill={RAIL}
            opacity="0.12"
          />
          <path d="M6 34 Q34 26 64 34 T122 34" fill="none" stroke={RAIL} strokeWidth="1.5" opacity="0.35" />
        </>
      )

    /* 登入逾時：球停在起點線，旁邊小沙漏 */
    case 'timeout':
      return (
        <>
          <Rail pocket={false} />
          <path d="M30 24 V78" stroke={RAIL} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.35" />
          <circle cx="30" cy="56" r="8" fill={CUE} stroke={RAIL} strokeWidth="1.2" />
          <g transform="translate(78 38)" stroke={GOLD} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 0 h18 M0 30 h18 M2 0 q7 12 7 15 q0 3 -7 15 M16 0 q-7 12 -7 15 q0 3 7 15" />
          </g>
          <path d="M87 46 v6" stroke={GOLD} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </>
      )
  }
}
