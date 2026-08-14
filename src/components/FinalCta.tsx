import { course } from '../content/course'
import { site } from '../content/site'
import { Button } from '../ui/Button'
import { formatPrice } from '../lib/format'

const lowestPrice = Math.min(...course.plans.map((p) => p.price))

export function FinalCta() {
  return (
    <section className="bg-ink-900 py-section lg:py-section-lg">
      <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-3xl text-white sm:text-4xl">
          你的專業已經夠了，缺的只是一套流程
        </h2>
        <p className="mt-5 text-lg text-white/70">
          12 週後，你手上會有一門能被購買的課程。現在報名可享早鳥價，名額 40 位。
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={site.checkoutUrl} size="lg">
            立即報名 · {formatPrice(lowestPrice)} 起
          </Button>
          <Button href={site.previewUrl} size="lg" variant="ghost">
            先看免費單元
          </Button>
        </div>

        <p className="mt-5 text-sm text-white/50">
          14 天無條件退費保證 · 無限期觀看 · 可開立統編發票
        </p>
      </div>
    </section>
  )
}
