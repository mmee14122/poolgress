import { course } from '../../content/course'
import { site } from '../../content/site'
import { Section } from '../../ui/Section'
import { Accordion } from '../../ui/Accordion'

/** E｜課程 FAQ：accordion 摺疊問答 */
export function Faq() {
  return (
    <Section id="faq" title="課程 FAQ">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        {course.faqs.map((faq) => (
          <Accordion key={faq.q} summary={faq.q}>
            <p className="text-sm leading-relaxed text-ink-500">{faq.a}</p>
          </Accordion>
        ))}
      </div>

      <p className="mt-5 text-sm text-ink-500">
        還有其他問題？寫信到{' '}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-semibold text-brand-700 underline underline-offset-4"
        >
          {site.contactEmail}
        </a>
      </p>
    </Section>
  )
}
