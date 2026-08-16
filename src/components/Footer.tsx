import type { ReactNode } from 'react'
import { site } from '../data/site'

/**
 * 集中式極簡頁尾：深藍黑底、暖白字、全部置中，多列橫向文字連結。
 *
 * 四列：主導覽 → 支援連結 → 公司聯絡 → 版權＋社群 icon。
 * 寬螢幕橫向一列，窄螢幕自動換行仍維持置中。
 *
 * 資料都在 data/site.ts：
 *   footerPrimary／footerSupport  兩列連結（href 為 null＝頁面待補，不可點）
 *   companyAddress／supportEmail／lineUrl  第三列
 *   social.*                      社群連結（null＝停用並顯示「即將公開」）
 */
export function Footer() {
  return (
    <footer className="bg-brand-950 text-ivory-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center sm:px-6">
        {/* 第一列：主導覽 */}
        <nav aria-label="頁尾主導覽">
          <Row separatorClass="text-white/25">
            {site.footerPrimary.map((item) => (
              <FooterLink
                key={item.label}
                href={item.href}
                className="text-base font-semibold text-ivory-50 hover:text-brass-300"
              >
                {item.label}
              </FooterLink>
            ))}
          </Row>
        </nav>

        {/* 第二列：支援連結 */}
        <nav aria-label="頁尾支援連結" className="mt-2">
          <Row separatorClass="text-white/20">
            {site.footerSupport.map((item) => (
              <FooterLink
                key={item.label}
                href={item.href}
                className="text-sm text-white/70 hover:text-white"
              >
                {item.label}
              </FooterLink>
            ))}
          </Row>
        </nav>

        {/* 第三列：公司聯絡 */}
        <address className="mt-2 not-italic">
          <Row separatorClass="text-white/20">
            {site.companyAddress && (
              <span className="inline-block py-2 text-sm text-white/60">
                {site.companyAddress}
              </span>
            )}
            <a
              href={`mailto:${site.supportEmail}`}
              className="inline-block py-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              {site.supportEmail}
            </a>
            <FooterLink
              href={site.lineUrl}
              external
              className="text-sm text-white/60 hover:text-white"
            >
              LINE 官方帳號
            </FooterLink>
          </Row>
        </address>

        {/* 版權與社群 */}
        <p className="mt-6 text-xs text-white/55">
          © {new Date().getFullYear()} {site.brandName}. All rights reserved.
        </p>

        <SocialLinks />
      </div>

      {/* 手機底部購買列的讓位空間 */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 一列置中的橫向連結，項目之間插入細直線分隔符號。
 * 窄螢幕會自動換行，分隔符號跟著留在行內，不影響置中。
 */
function Row({
  children,
  separatorClass,
}: {
  children: ReactNode
  separatorClass: string
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children]

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0">
      {items.map((child, i) => (
        <span key={i} className="inline-flex items-center">
          {child}
          {i < items.length - 1 && (
            <span aria-hidden="true" className={`px-1.5 ${separatorClass}`}>
              ｜
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * 頁尾連結。
 * href 為 null＝該頁／帳號尚未建立，顯示為不可點的低對比文字並標示待補，
 * 不會連到錯誤網址。
 */
function FooterLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string | null
  children: ReactNode
  className: string
  external?: boolean
}) {
  /* py-2 讓行動裝置的觸控區域夠大 */
  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="即將公開"
        className={`inline-block cursor-not-allowed py-2 opacity-45 ${className}`}
      >
        {children}
      </span>
    )
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`inline-block py-2 transition-colors ${className}`}
    >
      {children}
    </a>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 社群追蹤入口：只有官方辨識 icon，不放平台名稱文字、不加標籤。
 *
 * ・觸控區 44×44px，視覺 icon 20px
 * ・hover 只做顏色變化，不加框、不放大、不彈跳
 * ・手機同樣橫向排列
 * ・網址未填時為 aria-disabled 的 span，tooltip「即將公開」，不會連出去
 */
function SocialLinks() {
  const items: { name: string; href: string | null; icon: ReactNode }[] = [
    { name: 'Instagram', href: site.social.instagram, icon: <InstagramIcon /> },
    { name: 'Facebook', href: site.social.facebook, icon: <FacebookIcon /> },
    { name: 'YouTube', href: site.social.youtube, icon: <YoutubeIcon /> },
  ]

  return (
    <ul className="mt-3 flex items-center justify-center gap-1">
      {items.map((item) => (
        <li key={item.name}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              title={item.name}
              className="flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-white"
            >
              {item.icon}
            </a>
          ) : (
            <span
              role="link"
              aria-disabled="true"
              aria-label={`${item.name}：即將公開`}
              title="即將公開"
              className="flex h-11 w-11 cursor-not-allowed items-center justify-center text-white/25"
            >
              {item.icon}
            </span>
          )}
        </li>
      ))}
    </ul>
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
