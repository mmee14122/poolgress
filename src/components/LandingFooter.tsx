import { site } from '../data/site'
import { Logo } from './Logo'

/**
 * 一頁式首頁專用頁尾（2026-09-06）。
 * 全站 Footer 有課程／教練／帳號等尚未開放的欄位，這裡只留品牌、一句話、信箱與版權；
 * 深色 Charcoal 底，與上方「先從下一局開始。」連成一片收尾（同現行首頁作法）。
 */
export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="pg-footer-shell bg-[#252C30] text-[#F2EEE6]">
      <div className="site-container">
        <div className="flex flex-col gap-8 border-t border-[rgba(242,238,230,.1)] pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#F2EEE6]/70">
              把每一次上桌，變成可以練、可以比、可以分享的一局。
            </p>
          </div>

          <div className="text-sm">
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-[#F2EEE6]/80 underline-offset-4 transition-colors hover:text-[#D2C2AD] hover:underline"
            >
              {site.contactEmail}
            </a>
            <p className="mt-3 text-[10px] tracking-[0.2em] text-[#F2EEE6]/45 uppercase">Taipei · Taiwan</p>
          </div>
        </div>

        <p className="mt-10 text-xs text-[#F2EEE6]/45">© {year} Poolgress. All rights reserved.</p>
      </div>
    </footer>
  )
}
