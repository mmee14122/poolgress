import { course } from '../content/course'
import { Section, SectionHeading } from '../ui/Section'

export function PainPoints() {
  return (
    <Section tone="sand">
      <SectionHeading
        eyebrow="你是不是也這樣"
        title="想開課的人，通常卡在同樣四個地方"
        description="如果下面有兩點以上打中你，這門課就是為你設計的。"
      />

      <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {course.painPoints.map((point) => (
          <li
            key={point}
            className="flex gap-4 rounded-card bg-white p-6 ring-1 ring-sand-200"
          >
            <svg
              viewBox="0 0 20 20"
              className="mt-1 h-5 w-5 shrink-0 fill-ink-400"
              aria-hidden="true"
            >
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3.5a1 1 0 011 1V11a1 1 0 11-2 0V6.5a1 1 0 011-1zm0 9.5a1.1 1.1 0 110-2.2 1.1 1.1 0 010 2.2z" />
            </svg>
            <p className="text-ink-600">{point}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
