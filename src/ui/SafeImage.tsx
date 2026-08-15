import { useState, type ReactNode } from 'react'

/**
 * 圖片載入失敗（或尚未提供路徑）時顯示 fallback，版面不會崩壞。
 * 全站封面、情境圖、教練照片共用。
 *
 * src 傳 null／空字串＝直接顯示 fallback（素材待補的情況）。
 */
export function SafeImage({
  src,
  alt = '',
  className = '',
  fallback,
}: {
  src: string | null | undefined
  alt?: string
  className?: string
  fallback: ReactNode
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <>{fallback}</>

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}

/** 品牌漸層佔位：兩顆球＋虛線球路，尺寸由外層容器決定 */
export function CoverFallback({ label }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-900 to-brand-600">
      <svg viewBox="0 0 48 24" aria-hidden="true" className="h-10 w-20 opacity-70">
        <circle cx="12" cy="12" r="6" fill="#fbf9f5" />
        <circle cx="34" cy="12" r="6" fill="#d9a441" />
        <line
          x1="18"
          y1="12"
          x2="28"
          y2="12"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>
      {label && <p className="px-3 text-center text-xs text-white/50">{label}</p>}
    </div>
  )
}
