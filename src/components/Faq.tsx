import { course } from '../content/course'
import { site } from '../content/site'
import { Section, SectionHeading } from '../ui/Section'
import { Accordion } from '../ui/Accordion'

export function Faq() {
  return (
    <Section id="faq" tone="sand">
      <SectionHeading eyebrow="常見問題" title="報名前你可能想知道的事" />

      <div className="mx-auto max-w-3xl rounded-card bg-white px-6 ring-1 ring-sand-200 sm:px-8">
        {course.faqs.map((faq) => (
          <Accordion key={faq.q} summary={faq.q}>
            <p>{faq.a}</p>
          </Accordion>
        ))}
      </div>

      <p className="mt-8 text-center text-ink-600">
        還有其他問題？寫信到{' '}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-semibold text-brand-600 underline underline-offset-4"
        >
          {site.contactEmail}
        </a>
        ，通常一個工作天內回覆。
      </p>
    </Section>
  )
}
