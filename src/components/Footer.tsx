import type { ReactNode } from 'react'
import { site } from '../data/site'

/**
 * 全站頁尾：品牌、聯絡資訊、頁尾導覽與社群追蹤入口。
 *
 * 地址與社群網址都來自 data/site.ts：
 *   companyAddress 留空字串 → 該行不顯示
 *   social.* 留 null        → icon 以停用狀態呈現，tooltip「即將公開」，不連到錯誤網址
 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-bold text-ink-900">{site.brandName}</p>
          <p className="mt-1 text-sm text-ink-400">{site.tagline}</p>

          {/* 聯絡資訊 */}
          <address className="mt-4 space-y-1.5 text-sm not-italic text-ink-500">
            {site.companyAddress && (
              <p className="flex items-start gap-2">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 fill-ink-400"
                >
                  <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
                </svg>
                {site.companyAddress}
              </p>
            )}
            <p className="flex items-start gap-2">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 fill-ink-400"
              >
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 7L4 6v12h16V6zm0 2.3L20 8v-.7l-8 5-8-5V8z" />
              </svg>
              <a
                href={`mailto:${site.contactEmail}`}
                className="transition-colors hover:text-brand-700"
              >
                {site.contactEmail}
              </a>
            </p>
          </address>

          <p className="mt-4 text-sm text-ink-400">
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:items-end">
          <nav aria-label="頁尾導覽" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {site.footerLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                /* inline-block + py 讓行動裝置上的觸控區域夠大 */
                className="inline-block py-2.5 text-ink-500 transition-colors hover:text-brand-700"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <SocialLinks />
        </div>
      </div>

      {/* 手機底部購買列的讓位空間 */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 社群追蹤入口：只有官方辨識 icon，不放平台名稱文字、不加標籤。
 *
 * ・觸控區 44×44px，視覺 icon 20px（外框與 icon 大小分離）
 * ・hover 只做顏色變化，不加框、不放大、不彈跳
 * ・手機同樣是橫向排列（不隨斷點改成直式）
 * ・網址未填時為 <span aria-disabled>，有 tooltip「即將公開」，不會連出去
 */
function SocialLinks() {
  const items: { name: string; href: string | null; icon: ReactNode }[] = [
    { name: 'Instagram', href: site.social.instagram, icon: <InstagramIcon /> },
    { name: 'Facebook', href: site.social.facebook, icon: <FacebookIcon /> },
    { name: 'YouTube', href: site.social.youtube, icon: <YoutubeIcon /> },
  ]

  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-ink-400 lg:text-right">追蹤我們</p>
      <ul className="mt-1 flex items-center gap-1 lg:justify-end">
        {items.map((item) => (
          <li key={item.name}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                title={item.name}
                className="flex h-11 w-11 items-center justify-center text-ink-400 transition-colors hover:text-brand-700"
              >
                {item.icon}
              </a>
            ) : (
              <span
                role="link"
                aria-disabled="true"
                aria-label={`${item.name}：即將公開`}
                title="即將公開"
                className="flex h-11 w-11 cursor-not-allowed items-center justify-center text-ink-400/40"
              >
                {item.icon}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* 官方辨識 icon（簡潔實心風格，視覺重量一致；統一 20px） */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.68-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.22-1-.48-1.4-.9-.42-.4-.68-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.06 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.06 1.6.06 4.7.06s3.5 0 4.7-.06c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.06-1.2.06-1.6.06-3.3s0-2.1-.06-3.3c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.84-1.3-.4-.4-.8-.64-1.3-.84-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4z" />
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2A3.2 3.2 0 1112 8.8a3.2 3.2 0 010 6.4z" />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  )
}
