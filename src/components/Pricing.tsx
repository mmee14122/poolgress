import { course } from '../content/course'
import { site } from '../content/site'
import { Section, SectionHeading } from '../ui/Section'
import { Button } from '../ui/Button'
import { formatPrice } from '../lib/format'

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="方案與價格"
        title="選一個適合你現在的節奏"
        description="所有方案都包含完整課程影片與無限期觀看，差別在於有沒有人陪你走。"
      />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {course.plans.map((plan) => (
          <article
            key={plan.name}
            className={
              plan.featured
                ? 'relative rounded-card bg-ink-900 p-8 text-white shadow-xl lg:-mt-4 lg:pb-10'
                : 'rounded-card border border-sand-200 p-8'
            }
          >
            {plan.featured && (
              <p className="absolute -top-3 left-8 rounded-full bg-accent-400 px-3 py-1 text-xs font-bold text-ink-900">
                最多人選
              </p>
            )}

            <h3 className={`text-xl ${plan.featured ? 'text-white' : ''}`}>{plan.name}</h3>
            <p className={`mt-2 text-sm ${plan.featured ? 'text-white/60' : 'text-ink-600'}`}>
              {plan.description}
            </p>

            <p className="mt-6 flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-ink-900'}`}
              >
                {formatPrice(plan.price)}
              </span>
              {plan.originalPrice && (
                <span
                  className={`text-base line-through ${
                    plan.featured ? 'text-white/40' : 'text-ink-400'
                  }`}
                >
                  {formatPrice(plan.originalPrice)}
                </span>
              )}
            </p>

            <Button
              href={site.checkoutUrl}
              size="lg"
              variant={plan.featured ? 'primary' : 'secondary'}
              className="mt-6 w-full"
            >
              {plan.ctaLabel}
            </Button>

            <ul className="mt-8 space-y-3 text-sm">
              {plan.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      plan.featured ? 'fill-accent-400' : 'fill-brand-600'
                    }`}
                  >
                    <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                  </svg>
                  <span className={plan.featured ? 'text-white/80' : 'text-ink-600'}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-ink-400">
        可開立統編電子發票 · 支援信用卡分期
      </p>
    </Section>
  )
}
