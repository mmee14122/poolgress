import { course } from '../../data/course-detail'
import { Button } from '../../ui/Button'

/**
 * SECTION 05｜球桌 Challenge
 * 課程 × App 的連結亮點區：深色沉浸底、球路軌跡視覺，
 * 說明影片之外還有真實球桌上的 Challenge 練習。
 */
export function ChallengeSection() {
  const { challenge } = course.intro

  return (
    <section
      id="challenge"
      className="scroll-mt-[calc(var(--promo-h)+8rem)] py-10 lg:scroll-mt-[calc(var(--promo-h)+6rem)] lg:py-14"
    >
      <div className="relative overflow-hidden rounded-card bg-brand-950 px-6 py-10 text-white sm:px-10 lg:py-12">
        {/* 背景球路軌跡（裝飾） */}
        <svg
          viewBox="0 0 600 300"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
          preserveAspectRatio="xMidYMid slice"
        >
          <line x1="40" y1="260" x2="330" y2="120" stroke="#e6c478" strokeWidth="2" strokeDasharray="3 10" />
          <line x1="330" y1="120" x2="560" y2="40" stroke="#fbf9f5" strokeWidth="2" strokeDasharray="3 10" />
          <circle cx="330" cy="120" r="12" fill="none" stroke="#fbf9f5" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="560" cy="40" r="16" fill="none" stroke="#e6c478" strokeWidth="2" />
          <circle cx="40" cy="260" r="10" fill="#fbf9f5" />
        </svg>

        <div className="relative">
          <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
            {challenge.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl text-white sm:text-3xl">{challenge.title}</h2>

          <div className="mt-5 space-y-1 text-white/75">
            {challenge.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <p className="mt-4 text-2xl font-bold text-brass-300 sm:text-3xl">{challenge.quote}</p>

          <ul className="mt-7 space-y-2.5">
            {challenge.features.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/85">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 shrink-0 fill-brass-400">
                  <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-5 text-lg font-bold text-white">{challenge.punch}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {/* App 下載 QR code：素材備妥後在 data/course-detail.ts 填 qrCode 路徑，
                此處自動換成圖片（建議 512×512）；未提供時顯示待補佔位框 */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20">
              {challenge.qrCode ? (
                <img
                  src={challenge.qrCode}
                  alt="下載 Poolgress App 的 QR code"
                  className="h-full w-full object-contain p-1.5"
                />
              ) : (
                <span className="flex flex-col items-center gap-1.5 px-1 text-center">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-white/40">
                    <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zm-2 8h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm2 2h2v2h-2zm2 0h2v2h-2z" />
                  </svg>
                  <span className="text-[0.625rem] leading-tight text-white/50">QR code 待補</span>
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={challenge.ctaPrimary.href} size="lg">
                {challenge.ctaPrimary.label}
              </Button>
              <a
                href={challenge.ctaSecondary.href}
                className="text-sm font-semibold text-white/70 underline underline-offset-4 transition-colors hover:text-white"
              >
                {challenge.ctaSecondary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
