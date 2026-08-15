import type { ReactNode } from 'react'
import type { SectionId } from '../content/course'

type Props = {
  id: SectionId
  title: string
  /** 標題上方的小型導語 */
  eyebrow?: string
  description?: string
  children: ReactNode
}

/**
 * 中欄的內容區段。id 同時供左欄錨點與 scroll spy 使用。
 * scroll-mt 讓錨點捲動時標題不會被 sticky 導覽列蓋住（手機多一層標籤列，需要更大值）。
 */
export function Section({ id, title, eyebrow, description, children }: Props) {
  return (
    <section id={id} className="scroll-mt-40 py-10 lg:scroll-mt-32 lg:py-14">
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold tracking-widest text-brand-600">{eyebrow}</p>
      )}
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-ink-500">{description}</p>}
      <div className="mt-6 lg:mt-8">{children}</div>
    </section>
  )
}
