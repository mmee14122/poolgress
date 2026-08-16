import { course } from '../../data/course-detail'
import { appLinks } from '../../data/challenges'
import { site } from '../../data/site'
import { Button } from '../../ui/Button'

/**
 * SECTION 05｜球桌 Challenge
 *
 * 桌機直接顯示單一智慧 QR code 與兩個商店 badge；
 * 手機隱藏 QR code，只保留一個智慧下載按鈕。
 * 所有網址與圖片都由 data/site.ts 集中管理。
 */
export function ChallengeSection() {
  const { challenge } = course.intro
  const { appDownload } = site

  return (
    <section
      id="challenge"
      className="scroll-mt-[calc(var(--promo-h)+8rem)] py-10 lg:scroll-mt-[calc(var(--promo-h)+6rem)] lg:py-14"
    >
      <div className="relative overflow-hidden rounded-card bg-brand-950 px-6 py-10 text-white sm:px-10 lg:py-12">
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

          {/* 手機：同一個智慧網址由下載頁判斷 iOS／Android。 */}
          <div data-download-layout="mobile" className="mt-7 lg:hidden">
            {appDownload.smartUrl ? (
              <Button href={appDownload.smartUrl} size="lg" block>
                {challenge.ctaPrimary.label}
              </Button>
            ) : (
              <button
                type="button"
                disabled
                title="App 即將上架"
                className="flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-brand-600 px-6 text-base font-semibold text-white opacity-60"
              >
                {challenge.ctaPrimary.label}
              </button>
            )}
            <a
              href={challenge.ctaSecondary.href}
              className="mt-4 inline-block min-h-11 py-2.5 text-sm font-semibold text-white/70 underline underline-offset-4 transition-colors hover:text-white"
            >
              {challenge.ctaSecondary.label}
            </a>
          </div>

          {/* 桌機：QR code 直接露出，不再使用彈窗。 */}
          <div
            data-download-layout="desktop"
            className="mt-7 hidden items-center gap-6 rounded-2xl border border-white/15 bg-white/[0.06] p-5 lg:flex"
          >
            <SmartQrCode src={appDownload.qrCode} href={appDownload.smartUrl} />

            <div className="min-w-0">
              <p className="font-semibold text-white">下載 Poolgress App</p>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/65">
                掃描 QR code，或選擇你的裝置商店，把課程帶到球桌前。
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <StoreBadge platform="apple" href={appLinks.appStore} />
                <StoreBadge platform="google" href={appLinks.googlePlay} />
              </div>

              <a
                href={challenge.ctaSecondary.href}
                className="mt-4 inline-block min-h-11 py-2.5 text-sm font-semibold text-white/70 underline underline-offset-4 transition-colors hover:text-white"
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

function SmartQrCode({ src, href }: { src: string | null; href: string | null }) {
  const content = src ? (
    <img src={src} alt="Poolgress App 智慧下載 QR code" className="h-full w-full object-contain p-2" />
  ) : (
    <span className="flex flex-col items-center gap-1.5 text-center text-white/55">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
        <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zm-2 8h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm2 2h2v2h-2zm2 0h2v2h-2z" />
      </svg>
      <span className="text-[0.65rem] leading-tight">QR code 待補</span>
    </span>
  )

  const className =
    'flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/20'

  return href ? (
    <a href={href} aria-label="開啟 Poolgress App 智慧下載頁" className={className}>
      {content}
    </a>
  ) : (
    <div className={className} aria-label="Poolgress App QR code 即將公開">
      {content}
    </div>
  )
}

function StoreBadge({ platform, href }: { platform: 'apple' | 'google'; href: string | null }) {
  const apple = platform === 'apple'
  const label = apple ? 'App Store' : 'Google Play'
  const badge = (
    <>
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 fill-current">
        <path
          d={
            apple
              ? 'M16.7 12.8c0-2.5 2.1-3.7 2.2-3.8a4.8 4.8 0 00-3.8-2.1c-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9A5 5 0 003.7 9.4c-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.3 2.5 1.3-.1 1.8-.8 3.5-.8 1.6 0 2.1.8 3.5.8 1.5 0 2.4-1.3 3.2-2.5a11 11 0 001.5-3c0 0-3.3-1.3-3.3-3.9zM14.1 5.2A4.4 4.4 0 0015.2 2a4.6 4.6 0 00-3 1.5 4.2 4.2 0 00-1.1 3.1 3.8 3.8 0 003-1.4z'
              : 'M3.6 2.5a2 2 0 00-.5 1.4v16.2c0 .5.2 1 .5 1.4l9-9.5-9-9.5zm10.2 10.8l-2.3-2.4L4.3 3.3 16.8 10l-3 3.3zm3.9-2.1l-2.3 1.2-2.5-2.6 2.5-2.6 2.3 1.2c1.2.7 1.2 2.1 0 2.8zM4.3 20.7l7.2-7.6 2.3 2.4-9.5 5.2z'
          }
        />
      </svg>
      <span className="text-left leading-none">
        <span className="block text-[0.55rem] font-normal uppercase">
          {apple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="mt-0.5 block text-sm font-semibold">{label}</span>
      </span>
    </>
  )

  const className =
    'inline-flex min-h-12 min-w-40 items-center justify-center gap-2 rounded-lg border border-white/25 bg-ink-900 px-4 text-white transition-colors'

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`前往 ${label} 下載 Poolgress App`}
      className={`${className} hover:border-brass-300 hover:text-brass-300`}
    >
      {badge}
    </a>
  ) : (
    <span aria-disabled="true" title="即將上架" className={`${className} cursor-not-allowed opacity-55`}>
      {badge}
    </span>
  )
}
