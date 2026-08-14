import { course } from '../content/course'
import { Section, SectionHeading } from '../ui/Section'

export function Testimonials() {
  return (
    <Section id="testimonials" tone="ink">
      <SectionHeading
        eyebrow="學員成果"
        title="他們原本也覺得自己不夠格開課"
        inverted
      />

      {/* 手機：橫向 scroll-snap；桌機：grid。不用 carousel 套件。 */}
      <ul
        className="scroll-row -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:gap-6"
      >
        {course.testimonials.map((t) => (
          <li
            key={t.name}
            className="w-[85vw] max-w-sm shrink-0 snap-center rounded-card bg-white/5 p-7 ring-1 ring-white/10 sm:w-auto sm:max-w-none"
          >
            <p className="inline-flex rounded-full bg-accent-400/15 px-3 py-1 text-sm font-semibold text-accent-400">
              {t.result}
            </p>

            <blockquote className="mt-5 text-white/85">「{t.quote}」</blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white/70"
              >
                {t.name.slice(0, 1)}
              </span>
              <span>
                <span className="block font-semibold text-white">{t.name}</span>
                <span className="block text-sm text-white/50">{t.title}</span>
              </span>
            </figcaption>
          </li>
        ))}
      </ul>
    </Section>
  )
}
