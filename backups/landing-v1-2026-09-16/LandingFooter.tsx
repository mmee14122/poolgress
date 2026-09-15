import { landingContactEmail } from '../data/landing'
import { Logo } from './Logo'

/**
 * 一頁式首頁專用頁尾（2026-09-06 使用者定案版）。
 * 單欄置中：Logo → 英文標語 → 信箱 → 版權，桌機與手機同一個排法。
 * 深色 Charcoal 底，與上方「想一起打造這件事？」連成一片收尾。
 */
export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="pg-footer-shell bg-[#252C30] text-[#F2EEE6]">
      <div className="site-container">
        <div className="flex flex-col items-center gap-6 border-t border-[rgba(242,238,230,.1)] pt-12 text-center">
          <Logo dark href="#top" />

          <p className="text-sm leading-relaxed tracking-[0.04em] text-[#F2EEE6]/70">
            Better Pool. Better Life.
          </p>

          <a
            href={`mailto:${landingContactEmail}`}
            className="text-sm text-[#F2EEE6]/80 underline-offset-4 transition-colors hover:text-[#D2C2AD] hover:underline"
          >
            {landingContactEmail}
          </a>

          <p className="text-xs text-[#F2EEE6]/45">© {year} Poolgress</p>
        </div>
      </div>
    </footer>
  )
}
