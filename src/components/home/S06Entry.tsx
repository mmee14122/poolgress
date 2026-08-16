import { home } from '../../data/home'
import { Button } from '../../ui/Button'

/**
 * S5｜CTA：課程入口。
 * 願景整區已移至 about.html，這裡只留一行小字入口。
 */
export function S06Entry() {
  const { entry } = home

  return (
    <section id="entry" className="scroll-mt-24 bg-brand-950 py-16 text-white lg:py-24">
      <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
        <div className="rounded-card border border-white/15 bg-white/5 px-6 py-10 sm:px-10">
          <h2 className="text-xl text-white sm:text-2xl">{entry.title}</h2>
          <p className="mt-4 text-white/70">{entry.body}</p>
          <Button href={entry.cta.href} size="lg" className="mt-7">
            {entry.cta.label}
          </Button>

          {/* 願景的唯一首頁入口 */}
          <p className="mt-6 text-sm text-white/55">
            {entry.aboutLink.lead}{' '}
            <a
              href={entry.aboutLink.href}
              className="font-semibold text-white/75 underline underline-offset-4 transition-colors hover:text-brass-300"
            >
              {entry.aboutLink.label}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
