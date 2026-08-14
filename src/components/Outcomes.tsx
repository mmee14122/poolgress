import { course } from '../content/course'
import { Section, SectionHeading } from '../ui/Section'

export function Outcomes() {
  return (
    <Section>
      <SectionHeading
        eyebrow="上完課你會得到"
        title="不是「懂了」，是「做出來了」"
        description="每一項都對應到課程中的實際作業，結業時你手上會有一套能被購買的課程。"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {course.outcomes.map((outcome, i) => (
          <article
            key={outcome.title}
            className="rounded-card border border-sand-200 p-7 transition-colors hover:border-brand-500"
          >
            <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-xl">{outcome.title}</h3>
            <p className="mt-3 text-ink-600">{outcome.description}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
