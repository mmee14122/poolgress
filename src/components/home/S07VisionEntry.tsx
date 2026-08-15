import { home } from '../../content/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 07｜願景＋課程入口
 * 先講品牌願景（安靜、收斂），之後才進課程 CTA。
 * 金句在此不完整重複，改用「原來我做得到」延續。
 */
export function S07VisionEntry() {
  const { vision, entry } = home.visionEntry

  return (
    <section id="vision" className="scroll-mt-32 bg-brand-950 py-16 text-white lg:py-24">
      <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
        {/* 品牌願景 */}
        <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
          Poolgress 的長期願景
        </p>
        <h2 className="mt-4 text-2xl text-white sm:text-3xl">
          {vision.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <div className="mt-6 space-y-3 text-white/70">
          {vision.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-8 text-lg leading-relaxed text-white/85">
          {vision.hope.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        {/* 課程入口 */}
        <div className="mt-14 rounded-card border border-white/15 bg-white/5 px-6 py-10 sm:px-10">
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
