import type { ReactNode } from 'react'

type Props = {
  summary: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

/**
 * 原生 <details>：鍵盤操作、螢幕閱讀器語意由瀏覽器負責，
 * 內容長度變動時也不會像自刻 height 動畫那樣破版。
 */
export function Accordion({ summary, children, defaultOpen = false }: Props) {
  return (
    <details open={defaultOpen} className="group border-b border-line last:border-b-0">
      <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 transition-colors hover:bg-ivory-50 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex-1 font-semibold text-ink-900">{summary}</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="mt-1 h-5 w-5 shrink-0 fill-ink-400 transition-transform duration-200 group-open:rotate-180"
        >
          <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
        </svg>
      </summary>
      <div className="px-5 pb-5 sm:px-6">{children}</div>
    </details>
  )
}
