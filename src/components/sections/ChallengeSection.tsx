import { useEffect, useState } from 'react'
import { course } from '../../data/course-detail'
import { appLinks } from '../../data/challenges'
import { Button } from '../../ui/Button'

/**
 * SECTION 05｜球桌 Challenge
 * 課程 × App 的連結亮點區：深色沉浸底、球路軌跡視覺，
 * 說明影片之外還有真實球桌上的 Challenge 練習。
 */
/** 造訪裝置：決定按下下載後是直接跳商店還是顯示 QR code */
type Platform = 'ios' | 'android' | 'desktop'

/**
 * 判斷裝置平台。
 * iPadOS 13 以後的 Safari 會把自己報成 Macintosh，
 * 因此再用 maxTouchPoints 補判，否則 iPad 會被當成桌機。
 */
function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios'
  return 'desktop'
}

export function ChallengeSection() {
  const { challenge } = course.intro
  /** 桌機才彈出 QR code；手機直接跳商店（連結未上架時仍退回彈窗說明） */
  const [qrOpen, setQrOpen] = useState(false)

  function handleDownload() {
    const platform = detectPlatform()
    const storeUrl =
      platform === 'ios' ? appLinks.appStore : platform === 'android' ? appLinks.googlePlay : null

    /* 手機且商店連結已填 → 直接前往下載頁 */
    if (storeUrl) {
      window.location.href = storeUrl
      return
    }

    /* 桌機，或 App 尚未上架的手機 → 顯示說明彈窗 */
    setQrOpen(true)
  }

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

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* 點下載 → 彈出 iOS／Android 兩組 QR code */}
            <Button onClick={handleDownload} size="lg">
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

      {qrOpen && <QrDialog onClose={() => setQrOpen(false)} />}
    </section>
  )
}

/* ------------------------------------------------------------------ */

/**
 * App 下載彈窗。
 *
 * 桌機：顯示 iOS 與 Android 兩組 QR code，用手機掃描。
 * 手機：只有在商店連結尚未填時才會走到這裡（有連結時已直接跳轉），
 *       此時 QR code 對使用者沒有意義，改顯示該平台的「即將上架」說明。
 *
 * 圖片路徑填在 data/course-detail.ts 的 challenge.qrCodes；
 * 商店連結來自 data/challenges.ts 的 appLinks。
 */
function QrDialog({ onClose }: { onClose: () => void }) {
  const { qrCodes } = course.intro.challenge
  const platform = detectPlatform()
  const isMobile = platform !== 'desktop'

  /* Esc 關閉；開啟期間鎖住背景捲動 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-card bg-white p-6 text-ink-900 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="qr-dialog-title" className="text-lg">
              下載 Poolgress App
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              {isMobile ? 'App 尚未上架，敬請期待。' : '用手機掃描下方 QR code 前往商店。'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="-mt-1 -mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M5.3 4l4.7 4.7L14.7 4 16 5.3 11.3 10l4.7 4.7-1.3 1.3L10 11.3 5.3 16 4 14.7 8.7 10 4 5.3z" />
            </svg>
          </button>
        </div>

        {isMobile ? (
          /* 手機：只列出自己的平台，不放掃不到的 QR code */
          <div className="mt-6">
            <QrSlot
              label={platform === 'ios' ? 'iOS' : 'Android'}
              store={platform === 'ios' ? 'App Store' : 'Google Play'}
              src={null}
              href={platform === 'ios' ? appLinks.appStore : appLinks.googlePlay}
              hideQr
            />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <QrSlot label="iOS" store="App Store" src={qrCodes.ios} href={appLinks.appStore} />
            <QrSlot
              label="Android"
              store="Google Play"
              src={qrCodes.android}
              href={appLinks.googlePlay}
            />
          </div>
        )}

        <p className="mt-5 text-xs leading-relaxed text-ink-400">
          ⚠️ App 尚未上架，QR code 與商店連結皆為待補佔位。
          連結填入後，手機開啟會直接跳轉對應商店。
        </p>
      </div>
    </div>
  )
}

/** 單一平台的 QR code 格子 */
function QrSlot({
  label,
  store,
  src,
  href,
  hideQr = false,
}: {
  label: string
  store: string
  src: string | null
  href: string | null
  /** 手機上不顯示 QR code（自己掃自己沒有意義） */
  hideQr?: boolean
}) {
  return (
    <div className="rounded-card border border-line bg-ivory-50 p-4 text-center">
      <p className="text-sm font-bold text-ink-900">{label}</p>
      <p className="mt-0.5 text-xs text-ink-500">{store}</p>

      <div
        className={`mx-auto mt-3 aspect-square w-full max-w-[9rem] items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-line ${
          hideQr ? 'hidden' : 'flex'
        }`}
      >
        {src ? (
          <img
            src={src}
            alt={`${label} 版 Poolgress App 下載 QR code`}
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <span className="flex flex-col items-center gap-1.5 px-2 text-center">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-ink-400/60">
              <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zm-2 8h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm2 2h2v2h-2zm2 0h2v2h-2z" />
            </svg>
            <span className="text-[0.625rem] leading-tight text-ink-400">QR code 待補</span>
          </span>
        )}
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block min-h-11 text-sm font-semibold text-brand-700 hover:underline hover:underline-offset-4"
        >
          前往 {store}
        </a>
      ) : (
        <p className="mt-3 text-xs text-ink-400">即將上架</p>
      )}
    </div>
  )
}
