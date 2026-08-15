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
      <div className="grid gap-4 sm:grid-cols-3">
        {outcomes.cards.map((card, i) => (
          <div key={card.title} className="flex flex-col rounded-card border border-line bg-white p-5 sm:p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700 ring-1 ring-brand-200">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg">{card.title}</h3>
            <RichLines lines={card.lines} className="mt-3" />
          </div>
        ))}
      </div>
    </Section>
  )
}
