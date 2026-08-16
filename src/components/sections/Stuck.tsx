import { course } from '../../data/course-detail'
import { Section } from '../../ui/Section'
import { RichLines } from './RichLines'

/**
 * SECTION 02｜你可能正卡在這裡
 * 四張問題卡片讓使用者對照自己的狀態，結尾以強調引言收束。
 * 只描述狀態，不在這裡給答案。
 */
export function Stuck() {
  const { stuck } = course.intro

  return (
    <Section id="stuck" label="課程簡介" eyebrow={stuck.eyebrow} title={stuck.title}>
      <div className="grid gap-4 sm:grid-cols-2">
        {stuck.cards.map((card) => (
          <div key={card.title} className="rounded-card border border-line bg-white p-5 sm:p-6">
            <h3 className="text-base">{card.title}</h3>
            <RichLines lines={card.lines} className="mt-3" />
          </div>
        ))}
      </div>

      <blockquote className="mt-8 border-l-4 border-brand-500 py-1 pl-5 text-lg font-bold text-ink-900">
        {stuck.closing}
      </blockquote>
    </Section>
  )
}
