import type { ReactNode } from 'react'
import type { SectionId } from '../data/course-detail'

type Props = {
  id: SectionId
  title: string
  /** 標題上方的小型導語 */
  eyebrow?: string
  /** 區段小標題（與課程資訊同款：藍色直條＋文字），對應左側索引名稱 */
  label?: string
  description?: string
  children: ReactNode
}

/**
 * 中欄的內容區段。id 同時供左欄錨點與 scroll spy 使用。
 * scroll-mt 讓錨點捲動時標題不會被 sticky 導覽列蓋住（手機多一層標籤列，需要更大值）。
 */
export function Section({ id, title, eyebrow, label, description, children }: Props) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--promo-h)+8rem)] py-10 lg:scroll-mt-[calc(var(--promo-h)+6rem)] lg:py-14">
      {/* 區段小標題：與「課程資訊」同款，讓右側內容對應得上左側索引 */}
      {/* 用 p 不用 h2：本區段的主標題仍是下方的 h2，避免出現兩層同級標題 */}
      {label && (
        /* 字級與「課程資訊」「課程章節」的 h2 一致；
           用 p 需自行補 tracking／leading，因為全域 p 有 leading-[1.9] */
        <p className="mb-6 flex items-center gap-2.5 text-2xl leading-8 font-bold tracking-tight text-ink-900 sm:text-3xl sm:leading-9">
          <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand-600" />
          {label}
        </p>
      )}
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-widest text-brand-600">{eyebrow}</p>
      )}
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-ink-500">{description}</p>}
      <div className="mt-6 lg:mt-8">{children}</div>
    </section>
  )
}
