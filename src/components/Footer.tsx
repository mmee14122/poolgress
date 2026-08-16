import type { ReactNode } from 'react'
import { site } from '../data/site'
import { Logo } from './Logo'

/**
 * 全站頁尾：只放品牌與聯絡資訊，不放任何網站導覽連結
 * （那些入口在主導覽與各頁面內，頁尾不重複）。
 *
 * 結構、內容與間距只有一份，用 theme 切換配色：
 *   dark  首頁專用，延續 Hero 的深藍沉浸感
 *   light 其他所有頁面（課程、教練、個人區、支援頁…）
 *
 * 資料全部來自 data/site.ts：
 *   brandName／footerSlogan／companyAddress／supportEmail／social
 */
export type FooterTheme = 'dark' | 'light'

/** 兩種主題的色彩對照（結構共用，只換顏色） */
const themes: Record<
  FooterTheme,
  {
    shell: string
    brand: string
    slogan: string
    label: string
    text: string
    link: string
    icon: string
    iconDisabled: string
    divider: string
    copyright: string
    logoDark: boolean
  }
> = {
  dark: {
    shell: 'bg-brand-950',
    brand: 'text-white',
    slogan: 'text-white/75',
    label: 'text-white/50',
    text: 'text-white/85',
    link: 'text-white/85 hover:text-brass-300',
    icon: 'text-white/70 hover:text-brass-300',
    iconDisabled: 'text-white/40',
    divider: 'border-white/10',
    copyright: 'text-white/55',
    logoDark: true,
  },
  light: {
    shell: 'border-t border-line bg-ivory-50',
    brand: 'text-ink-900',
    slogan: 'text-ink-500',
    label: 'text-ink-400',
    text: 'text-ink-700',
    link: 'text-ink-700 hover:text-brand-700',
    icon: 'text-ink-500 hover:text-brand-600',
    iconDisabled: 'text-ink-400/40',
    divider: 'border-line',
    copyright: 'text-ink-500',
    logoDark: false,
  },
}

export function Footer({ theme = 'light' }: { theme?: FooterTheme }) {
  const t = themes[theme]

  return (
    <footer className={t.shell}>
      {/* 最大寬度與導覽列、頁面主內容對齊 */}
      <div className="mx-auto w-full max-w-[90rem] px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          {/* ── 左：品牌 ── */}
          <div className="max-w-md">
            {/* Logo 元件本身已含標誌＋文字商標；放大一級讓品牌比其他頁尾文字顯眼 */}
            <Logo dark={t.logoDark} className="-ml-1 [&>span]:text-2xl [&>svg]:h-11 [&>svg]:w-11" />
            <p className={`mt-3 text-base leading-relaxed ${t.slogan}`}>{site.footerSlogan}</p>
          </div>

          {/* ── 右：聯絡資訊與社群 ── */}
          <div className="lg:text-right">
            <address className="space-y-3 not-italic">
              {site.companyAddress && (
                <div>
                  <p className={`text-xs font-semibold tracking-wide ${t.label}`}>公司地址</p>
                  <p className={`mt-1 text-base ${t.text}`}>{site.companyAddress}</p>
                </div>
              )}
              <div>
                <p className={`text-xs font-semibold tracking-wide ${t.label}`}>聯絡信箱</p>
                <a
                  href={`mailto:${site.supportEmail}`}
                  className={`mt-1 inline-block text-base transition-colors ${t.link}`}
                >
                  {site.supportEmail}
                </a>
              </div>
            </address>

            <SocialLinks theme={t} />
          </div>
        </div>

        {/* ── 版權 ── */}
        <div className={`mt-10 border-t pt-6 ${t.divider}`}>
          <p className={`text-xs ${t.copyright}`}>
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* 手機底部購買列的讓位空間 */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 社群 icon：只有官方辨識圖形，不放平台名稱文字。
 *
 * ・視覺 32px、觸控區 48×48px，之間留約 24px
 * ・沒有方框、圓底或膠囊，只有乾淨的 icon
 * ・hover 只換顏色（深色底轉淺金、淺色底轉品牌藍）
 * ・未填網址時為 aria-disabled 的 span，tooltip「即將公開」，不會連出去
 */
function SocialLinks({ theme }: { theme: (typeof themes)[FooterTheme] }) {
  const items: { name: string; href: string | null; icon: ReactNode }[] = [
    { name: 'Instagram', href: site.social.instagram, icon: <InstagramIcon /> },
    { name: 'Facebook', href: site.social.facebook, icon: <FacebookIcon /> },
    { name: 'YouTube', href: site.social.youtube, icon: <YoutubeIcon /> },
  ]

  return (
    <ul className="mt-6 flex items-center gap-1.5 lg:justify-end">
      {items.map((item) => (
        <li key={item.name}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              title={item.name}
              className={`flex h-12 w-12 items-center justify-center transition-colors ${theme.icon}`}
            >
              {item.icon}
            </a>
          ) : (
            <span
              role="link"
              aria-disabled="true"
              aria-label={`${item.name}：即將公開`}
              title="即將公開"
              className={`flex h-12 w-12 cursor-not-allowed items-center justify-center ${theme.iconDisabled}`}
            >
              {item.icon}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/* 官方辨識 icon（簡潔實心風格，視覺重量一致；統一 32px） */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.68-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.22-1-.48-1.4-.9-.42-.4-.68-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.84-.4.4-.64.8-.84 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.06 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.84 1.3.4.4.8.64 1.3.84.4.16 1 .35 2.1.4 1.2.06 1.6.06 4.7.06s3.5 0 4.7-.06c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.84.4-.4.64-.8.84-1.3.16-.4.35-1 .4-2.1.06-1.2.06-1.6.06-3.3s0-2.1-.06-3.3c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.44-.9-.84-1.3-.4-.4-.8-.64-1.3-.84-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4z" />
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 8.2A3.2 3.2 0 1112 8.8a3.2 3.2 0 010 6.4z" />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
      <path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z" />
    </svg>
  )
}
