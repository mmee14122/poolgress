import { course } from '../content/course'
import { Section } from '../ui/Section'

export function Guarantee() {
  return (
    <Section>
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-card border-2 border-brand-100 bg-brand-50 p-8 sm:flex-row sm:p-10">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-12 w-12 shrink-0 fill-brand-600"
        >
          <path d="M12 2l8 3.5v5.8c0 4.9-3.4 9.4-8 10.7-4.6-1.3-8-5.8-8-10.7V5.5L12 2zm-1.2 14.2l6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6z" />
        </svg>

        <div>
          <h2 className="text-2xl">{course.guarantee.title}</h2>
          <p className="mt-3 text-ink-600">{course.guarantee.description}</p>
        </div>
      </div>
    </Section>
  )
}
