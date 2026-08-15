import { home } from '../../content/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 01｜Hero
 * 5 秒內傳達：這是撞球、不是給高手的、跟「我能不能做到」有關。
 * 視覺：球剛進袋的瞬間（純圖形語言，不放獎盃或賽事感）。
 */
export function S01Hero() {
  const { hero } = home

  return (
    <section id="hero" className="relative overflow-hidden bg-brand-950 text-white">
      {/* 檯面光暈 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(56,126,217,0.35),transparent)]"
      />

      <div className="relative mx-auto grid w-full max-w-[80rem] gap-12 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:pt-24 lg:pb-28">
        <div>
          <h1 className="text-[2rem] leading-[1.35] font-bold text-white sm:text-5xl sm:leading-[1.3] lg:text-[3.25rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">{hero.subtitle}</p>

          <p className="mt-8 text-lg font-semibold text-brass-300 sm:text-xl">{hero.core}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={hero.cta.href} size="lg">
              {hero.cta.label}
            </Button>
            {/* hover：流暢藍底 + 深色字（! 確保蓋過 quiet variant 的 hover 底色） */}
            <Button
              href={hero.ctaSecondary.href}
              size="lg"
              variant="quiet"
              className="text-white transition-colors hover:bg-brand-500! hover:text-black! active:bg-brand-500/85!"
            >
              {hero.ctaSecondary.label}
            </Button>
          </div>
        </div>

        {/* 進袋瞬間：袋口、衝進袋的球、殘影軌跡 */}
        <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <svg viewBox="0 0 400 400" className="h-full w-full">
            {/* 檯面一角 */}
            <path d="M40 360 L40 80 Q40 40 80 40 L360 40" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="24" strokeLinecap="round" />
            {/* 袋口 */}
            <circle cx="72" cy="72" r="34" fill="#060d1a" />
            <circle cx="72" cy="72" r="34" fill="none" stroke="rgba(230,196,120,0.55)" strokeWidth="3" />
            {/* 軌跡殘影 */}
            <line x1="320" y1="300" x2="110" y2="106" stroke="rgba(255,255,255,0.22)" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
            {/* 剛進袋的球（半沒入袋口） */}
            <circle cx="94" cy="93" r="21" fill="#fbf9f5" />
            <circle cx="88" cy="87" r="7" fill="rgba(255,255,255,0.9)" opacity="0.35" />
            {/* 衝擊光 */}
            <g stroke="#e6c478" strokeWidth="3" strokeLinecap="round">
              <line x1="128" y1="52" x2="142" y2="38" />
              <line x1="140" y1="96" x2="158" y2="94" />
              <line x1="58" y1="124" x2="52" y2="142" />
            </g>
            {/* 遠處的母球 */}
            <circle cx="320" cy="300" r="17" fill="rgba(255,255,255,0.85)" />
          </svg>
        </div>
      </div>
    </section>
  )
}
