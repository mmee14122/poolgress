import { site } from '../data/site'

/**
 * Poolgress 標誌：對稱四葉圓潤十字（單一路徑）+ 準星瞄準鏡
 * （白圓、細環、環外四條長刻度深入花瓣）。
 * 導覽列與登入頁共用；點擊回首頁（相對路徑，子資料夾部署也正確）。
 */
export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <a href="./" className={`flex shrink-0 items-center gap-2 py-2 ${className}`}>
      {/* 深色導覽列時標誌改白色、準星鏤空改深藍，維持相同造型 */}
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9">
        <path
          fill={dark ? '#ffffff' : 'var(--color-brand-900)'}
          d="M24 2.5
             C28.7 2.5 31.5 5.2 31.5 9
             C31.5 12.8 35.2 16.5 39 16.5
             C42.8 16.5 45.5 19.3 45.5 24
             C45.5 28.7 42.8 31.5 39 31.5
             C35.2 31.5 31.5 35.2 31.5 39
             C31.5 42.8 28.7 45.5 24 45.5
             C19.3 45.5 16.5 42.8 16.5 39
             C16.5 35.2 12.8 31.5 9 31.5
             C5.2 31.5 2.5 28.7 2.5 24
             C2.5 19.3 5.2 16.5 9 16.5
             C12.8 16.5 16.5 12.8 16.5 9
             C16.5 5.2 19.3 2.5 24 2.5
             Z"
        />
        <circle cx="24" cy="24" r="7" fill={dark ? 'var(--color-brand-950)' : 'white'} />
        <circle
          cx="24"
          cy="24"
          r="11.5"
          fill="none"
          stroke={dark ? 'var(--color-brand-950)' : 'white'}
          strokeWidth="1.5"
        />
        <g
          stroke={dark ? 'var(--color-brand-950)' : 'white'}
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <line x1="24" y1="4.2" x2="24" y2="10.4" />
          <line x1="24" y1="37.6" x2="24" y2="43.8" />
          <line x1="4.2" y1="24" x2="10.4" y2="24" />
          <line x1="37.6" y1="24" x2="43.8" y2="24" />
        </g>
      </svg>
      <span
        className={`font-logo text-xl font-semibold tracking-tight transition-colors duration-250 ${
          dark ? 'text-white' : 'text-brand-900'
        }`}
      >
        {site.brandName}
      </span>
    </a>
  )
}
