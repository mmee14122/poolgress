import { course } from '../content/course'
import { Section, SectionHeading } from '../ui/Section'
import { Accordion } from '../ui/Accordion'

const totalLessons = course.curriculum.reduce((sum, c) => sum + c.lessons.length, 0)

export function Curriculum() {
  return (
    <Section id="curriculum" tone="sand">
      <SectionHeading
        eyebrow="課程大綱"
        title="12 週，五個階段"
        description={`共 ${course.curriculum.length} 個章節、${totalLessons} 個單元。點開任一章節看細部內容。`}
      />

      <div className="mx-auto max-w-3xl rounded-card bg-white px-6 ring-1 ring-sand-200 sm:px-8">
        {course.curriculum.map((chapter, i) => (
          <Accordion
            key={chapter.title}
            summary={chapter.title}
            meta={chapter.duration}
            defaultOpen={i === 0}
          >
            <ul className="space-y-3">
              {chapter.lessons.map((lesson) => (
                <li key={lesson} className="flex gap-3">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-1.5 h-4 w-4 shrink-0 fill-brand-500"
                    aria-hidden="true"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.8 13.4L5.6 10.2l1.4-1.4 1.8 1.8 4-4 1.4 1.4-5.4 5.4z" />
                  </svg>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-400 sm:hidden">{chapter.duration}</p>
          </Accordion>
        ))}
      </div>
    </Section>
  )
}
