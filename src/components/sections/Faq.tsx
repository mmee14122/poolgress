import { course } from '../../content/course'
import { site } from '../../content/site'
import { Section } from '../../ui/Section'
import { Accordion } from '../../ui/Accordion'

export function Faq() {
  return (
    <Section id="faq" title="課程 FAQ">
      <div className="overflow-hidden rounded-card border border-line bg-white">
        {course.faqs.map((faq) => (
          <Accordion key={faq.q} summary={faq.q}>
            <p className="text-sm text-ink-500">{faq.a}</p>
          </Accordion>
        ))}
      </div>

      <p className="mt-5 text-sm text-ink-500">
        還有其他問題？寫信到{' '}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-semibold text-felt-700 underline underline-offset-4"
        >
          {site.contactEmail}
        </a>
        ，通常一個工作天內回覆。
      </p>
    </Section>
  )
}
