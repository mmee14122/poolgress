import { course } from '../../content/course'
import { Section } from '../../ui/Section'
import { RichLines } from './RichLines'

/**
 * SECTION 03｜學完後，你會有什麼不同？
 * 三張成果卡片：理解、做到、知道。
 */
export function Outcomes() {
  const { outcomes } = course.intro

  return (
    <Section id="outcomes" title={outcomes.title} description={outcomes.sub}>
      {/* 全寬直排，避免中欄裡的三窄欄導致文字過度換行 */}
      <div className="space-y-4">
        {outcomes.cards.map((card, i) => (
          <div key={card.title} className="flex gap-4 rounded-card border border-line bg-white p-5 sm:gap-5 sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-200">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg">{card.title}</h3>
              <RichLines lines={card.lines} className="mt-2.5" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
