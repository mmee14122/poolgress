import type { ReactNode } from 'react'

type Props = {
  summary: ReactNode
  /** 顯示在標題右側的次要資訊，例如時數 */
  meta?: string
  children: ReactNode
  defaultOpen?: boolean
}

/**
 * 用原生 <details> 而非自刻 height 動畫 ——
 * 內容長度變動時不會破版，且鍵盤與螢幕閱讀器行為免費取得。
 */
export function Accordion({ summary, meta, children, defaultOpen = false }: Props) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-sand-200 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
        <span className="flex-1 font-semibold text-ink-900">{summary}</span>
        {meta && <span className="hidden text-sm text-ink-400 sm:block">{meta}</span>}
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-5 w-5 shrink-0 fill-ink-400 transition-transform duration-200 group-open:rotate-45"
        >
          <path d="M9 4h2v12H9z" />
          <path d="M4 9h12v2H4z" />
        </svg>
      </summary>

      <div className="pb-6 text-ink-600">{children}</div>
    </details>
  )
}
