import { home } from '../../data/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 07｜課程入口
 * 首頁收尾的課程 CTA。品牌願景已移至 about.html，此區不再重複。
 * 金句在此不完整重複，改用「原來我做得到」延續。
 */
export function S07VisionEntry() {
  const { entry } = home.visionEntry

  return (
    <section id="vision" className="scroll-mt-24 bg-brand-950 py-16 text-white lg:py-24">
      <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
        {/* 課程入口 */}
        <div className="rounded-card border border-white/15 bg-white/5 px-6 py-10 sm:px-10">
          <h3 className="text-xl text-white sm:text-2xl">{entry.title}</h3>
          <div className="mt-4 space-y-1 text-white/70">
            {entry.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-5 text-white/70">
            {entry.echoLead}
            <span className="mt-1 block text-xl font-bold text-brass-300">{entry.echo}</span>
          </p>
          <Button href={entry.cta.href} size="lg" className="mt-7">
            {entry.cta.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
