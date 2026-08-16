import type { ReactNode } from 'react'
import { site } from '../data/site'
import { Logo } from './Logo'

/**
 * 全站頁尾：三欄式資訊頁尾（品牌聯絡／App 下載／支援合作）。
 *
 * 結構、內容與間距只有一份，用 theme 切換配色：
 *   dark  首頁專用，延續 Hero 的深藍沉浸感
 *   light 其他所有頁面（課程、教練、個人區、支援頁…）
 *
 * 所有網址、地址、Email、社群與 App 連結都來自 data/site.ts，
 * 元件本身不寫死任何資料。
 */
export type FooterTheme = 'dark' | 'light'

type Palette = {
  shell: string
  heading: string
  slogan: string
  label: string
  text: string
  link: string
  icon: string
  iconDisabled: string
  divider: string
  copyright: string
  qrFrame: string
  badge: string
  badgeDisabled: string
  logoDark: boolean
}

/** 兩種主題的色彩對照（結構共用，只換顏色） */
const themes: Record<FooterTheme, Palette> = {
  dark: {
    shell: 'bg-brand-950',
    heading: 'text-white',
    slogan: 'text-white/75',
    label: 'text-brass-300',
    text: 'text-white/80',
    link: 'text-white/80 hover:text-brass-300',
    icon: 'text-white/70 hover:text-brass-300',
    iconDisabled: 'text-white/40',
    divider: 'border-white/10',
    copyright: 'text-white/55',
    qrFrame: 'border-white/15 bg-white/5 text-white/45',
    badge: 'border-white/25 text-white hover:border-brass-300 hover:text-brass-300',
    badgeDisabled: 'border-white/15 text-white/55',
    logoDark: true,
  },
  light: {
    shell: 'border-t border-line bg-ivory-50',
    heading: 'text-ink-900',
    slogan: 'text-ink-500',
    label: 'text-brass-700',
    text: 'text-ink-700',
    link: 'text-ink-700 hover:text-brand-700',
    icon: 'text-ink-500 hover:text-brand-600',
    iconDisabled: 'text-ink-400/40',
    divider: 'border-line',
    copyright: 'text-ink-500',
    qrFrame: 'border-line bg-white text-ink-400',
    badge: 'border-line text-ink-700 hover:border-brand-500 hover:text-brand-700',
    badgeDisabled: 'border-line text-ink-400/60',
    logoDark: false,
  },
}

export function Footer({ theme = 'light' }: { theme?: FooterTheme }) {
  const t = themes[theme]

  return (
    <footer className={t.shell}>
      {/* 最大寬度與導覽列、頁面主內容對齊 */}
      <div className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-6 lg:py-14">
        {/* 四欄對齊頂部；最右下載區略寬，QR 與 badge 才不會擁擠 */}
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-10">
          <BrandColumn t={t} />
          <LinkGroup t={t} title="加入與合作" items={site.footerJoin} />
          <LinkGroup t={t} title="支援與條款" items={site.footerSupport} />
          <AppColumn t={t} />
        </div>

        {/* 版權：極淡分隔線，與內容欄位左緣對齊 */}
        <div className={`mt-12 border-t pt-6 ${t.divider}`}>
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

/** 第一欄：Logo、地址、信箱（緊接 Logo 下方，無標語），社群 icon 在最下方 */
function BrandColumn({ t }: { t: Palette }) {
  return (
    <div className="max-w-sm">
      <Logo dark={t.logoDark} className="-ml-1 [&>span]:text-2xl [&>svg]:h-11 [&>svg]:w-11" />

      <address className="mt-5 space-y-3 not-italic">
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

      <SocialLinks t={t} />
    </div>
  )
}

/* ------------------------------------------------------------------ */

/** 最右欄：App 下載（單一 QR code ＋ 兩個商店 badge ＋ 下方唯一一句文案） */
function AppColumn({ t }: { t: Palette }) {
  const { qrCode, outro, appStore, googlePlay } = site.appDownload

  return (
    <div className="max-w-md">
      <h2 className={`text-base font-bold ${t.heading}`}>下載 Poolgress App</h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* QR code：只有一個，指向智慧下載頁（依裝置分流） */}
        <div className="shrink-0">
          <div
            className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border ${t.qrFrame}`}
          >
            {qrCode ? (
              <img
                src={qrCode}
                alt="下載 Poolgress App 的 QR code"
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <span className="flex flex-col items-center gap-1.5 px-2 text-center">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
                  <path d="M3 3h8v8H3zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zM13 3h8v8h-8zm2 2v4h4V5zm-2 8h2v2h-2zm4 0h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm2 2h2v2h-2zm2 0h2v2h-2z" />
                </svg>
                <span className="text-[0.625rem] leading-tight">QR code 待補</span>
              </span>
            )}
          </div>
        </div>

        {/* 商店 badge：維持官方比例（約 3.375:1） */}
        <div className="flex flex-col gap-2.5">
          <StoreBadge
            t={t}
            href={appStore}
            store="App Store"
            lead="Download on the"
            icon={<AppleIcon />}
          />
          <StoreBadge
            t={t}
            href={googlePlay}
            store="Google Play"
            lead="GET IT ON"
            icon={<GooglePlayIcon />}
          />
        </div>
      </div>

      {/* 下載區最下方唯一一句文案：小一級、低對比，不是 CTA 也不可點 */}
      <p className={`mt-4 max-w-[22rem] text-sm leading-snug ${t.slogan}`}>{outro}</p>
    </div>
  )
}

/**
 * 商店下載 badge。
 * 未上架（href 為 null）時以停用樣式呈現並標示「即將上架」，不放假連結。
 */
function StoreBadge({
  t,
  href,
  store,
  lead,
  icon,
}: {
  t: Palette
  href: string | null
  store: string
  lead: string
  icon: ReactNode
}) {
  /* 官方 badge 比例約 3.375:1，這裡以 h-12 / w-[10.125rem] 對應 */
  const shape =
    'flex h-12 w-[10.125rem] items-center gap-2.5 rounded-lg border px-3 transition-colors'

  const inner = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 text-left leading-none">
        <span className="block text-[0.5rem] tracking-wide uppercase">{lead}</span>
        <span className="mt-0.5 block truncate text-sm font-semibold">{store}</span>
      </span>
    </>
  )

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="即將上架"
        className={`${shape} cursor-not-allowed ${t.badgeDisabled}`}
      >
        {inner}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`前往 ${store} 下載 Poolgress App`}
      title={store}
      className={`${shape} ${t.badge}`}
    >
      {inner}
    </a>
  )
}

/* ------------------------------------------------------------------ */

/** 連結群組：小標題＋文字連結（加入與合作／支援與條款共用） */
function LinkGroup({
  t,
  title,
  items,
}: {
  t: Palette
  title: string
  items: readonly { label: string; href: string }[]
}) {
  return (
    <nav aria-label={title}>
      <h2 className={`text-xs font-semibold tracking-wide ${t.label}`}>{title}</h2>
      <ul className="mt-2">
        {items.map((item) => (
          <li key={item.href}>
            {/* py-2 讓行動裝置的觸控區域夠大 */}
            <a href={item.href} className={`inline-block py-2 text-sm transition-colors ${t.link}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 社群 icon：只有官方辨識圖形，不放平台名稱文字。
 *
 * ・視覺 32px、觸控區 48×48px；沒有方框、圓底或膠囊
 * ・hover 只換顏色（深色底轉淺金、淺色底轉品牌藍）
 * ・未填網址時為 aria-disabled 的 span，tooltip「即將公開」，不會連出去
 */
function SocialLinks({ t }: { t: Palette }) {
  const items: { name: string; href: string | null; icon: ReactNode }[] = [
    { name: 'Instagram', href: site.social.instagram, icon: <InstagramIcon /> },
    { name: 'Facebook', href: site.social.facebook, icon: <FacebookIcon /> },
    { name: 'YouTube', href: site.social.youtube, icon: <YoutubeIcon /> },
  ]

  return (
    <ul className="mt-5 flex items-center gap-1.5">
      {items.map((item) => (
        <li key={item.name}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              title={item.name}
              className={`flex h-12 w-12 items-center justify-center transition-colors ${t.icon}`}
            >
              {item.icon}
            </a>
          ) : (
            <span
              role="link"
              aria-disabled="true"
              aria-label={`${item.name}：即將公開`}
              title="即將公開"
              className={`flex h-12 w-12 cursor-not-allowed items-center justify-center ${t.iconDisabled}`}
            >
              {item.icon}
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

/* 官方辨識 icon（簡潔實心風格，視覺重量一致；社群統一 32px） */

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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.2 1.2-2.4 1.2-2.5s-2.4-.9-2.4-3.7zM14.2 5.9c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
    </svg>
  )
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M3.6 2.4a1 1 0 00-.4.8v17.6a1 1 0 00.4.8l9.3-9.6zm10.5 8.3l2.9-3-8.6-4.9zm0 2.6l-5.7 7.9 8.6-4.9zm4.2-2.2l-2.4-1.4-3.1 3.2 3.1 3.2 2.4-1.4c1-.6 1-1.9 0-2.5z" />
    </svg>
  )
}
