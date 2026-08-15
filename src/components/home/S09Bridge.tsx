import { home } from '../../content/home'
import { Button } from '../../ui/Button'

/**
 * SECTION 09｜銜接課程
 * 品牌敘事 → 課程商品的橋。視覺從品牌漸轉為「解鎖路徑」的產品感，
 * 讀完應該自然往下找「第一堂是哪一堂」。
 */
export function S09Bridge() {
  const { bridge } = home

  return (
    <section
      id="bridge"
      className="scroll-mt-24 bg-felt-950 bg-gradient-to-b from-felt-900 via-felt-950 to-felt-950 py-16 text-white lg:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <h2 className="text-2xl text-white sm:text-4xl">
          {bridge.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-5 space-y-1 text-white/70">
          {bridge.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* 逐步解鎖的路徑 */}
        <ol className="mx-auto mt-10 max-w-xs space-y-0 text-left">
          {bridge.path.map((step, i) => {
            const last = i === bridge.path.length - 1
            return (
              <li key={step} className="relative flex items-center gap-4 pb-8 last:pb-0">
                {!last && (
                  <span aria-hidden="true" className="absolute top-9 left-[1.05rem] bottom-0 w-px bg-white/20" />
                )}
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ${
                    last
                      ? 'bg-brass-400 text-felt-950 ring-brass-300'
                      : 'bg-white/10 text-white/80 ring-white/20'
                  }`}
                >
                  {last ? (
                    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
                      <path d="M10 1.6l2.6 5.2 5.8.85-4.2 4.1.99 5.75L10 14.8l-5.19 2.7.99-5.75-4.2-4.1 5.8-.85z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={last ? 'font-bold text-brass-300' : 'text-white/85'}>{step}</span>
              </li>
            )
          })}
        </ol>

        <p className="mt-10 text-white/85">{bridge.close}</p>

        <div className="mt-10">
          <p className="text-lg font-semibold text-white">{bridge.prompt}</p>
          <Button href={bridge.cta.href} size="lg" className="mt-6">
            {bridge.cta.label}
          </Button>
          <p aria-hidden="true" className="mt-8 animate-bounce text-2xl text-white/40">
            ↓
          </p>
        </div>
      </div>
    </section>
  )
}
