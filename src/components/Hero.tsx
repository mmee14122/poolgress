import { course } from '../content/course'
import { site } from '../content/site'
import { Button } from '../ui/Button'
import { formatPrice } from '../lib/format'

const lowestPrice = Math.min(...course.plans.map((p) => p.price))

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink-900 text-white">
      {/* 背景光暈，純裝飾 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-accent-400 ring-1 ring-white/15">
            2026 春季班 · 名額 40 位
          </p>

          <h1 className="text-4xl leading-[1.25] text-white sm:text-5xl lg:text-[3.4rem]">
            {course.title}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/75">{course.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={site.checkoutUrl} size="lg">
              立即報名 · {formatPrice(lowestPrice)} 起
            </Button>
            <Button href={site.previewUrl} size="lg" variant="ghost">
              免費試看第一單元
            </Button>
          </div>

          <p className="mt-4 text-sm text-white/50">14 天內未達 20% 進度可全額退費</p>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {course.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-white/55">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 課程預覽影片位置 —— 換成 <iframe> 或 <video> 時保留 aspect-video 以免 CLS */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/15">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-sm">課程預覽影片</span>
          </div>
        </div>
      </div>
    </section>
  )
}
