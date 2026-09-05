import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { LanguageMenu } from './LanguageMenu'
import { CartHover, CartDrawerButton } from './cart/CartWidget'
import { Logo } from './Logo'
import { AccountMenu } from './AccountMenu'
import { useSession } from '../lib/session'

type NavTheme = 'light' | 'hero'

/**
 * Navbar state（2026-09-05 Phase 1 state architecture，樣式見 styles/nav.css）：
 *   transparent-light  深色影像上的透明態（首頁 Hero 頂端）
 *   transparent-dark   亮底上的透明態（目前沒有頁面使用，預留）
 *   solid-light        淺色實底：首頁捲動後的 Ivory floating、其他頁的白色 sticky
 *   solid-dark         深色實底：舊首頁 data-nav-dark 區塊上方
 * surface 決定容器形狀：none（透明）／floating（首頁浮板）／page（其他頁 sticky）。
 * 顏色一律由 nav.css 的 state 變數決定，這個檔案不再寫任何顏色。
 */
export type NavState = 'transparent-light' | 'transparent-dark' | 'solid-light' | 'solid-dark'
type NavSurface = 'none' | 'floating' | 'page'

/** 導覽連結：尺寸與 hover system 見 .pg-nav-link；顏色來自 state 變數 */
const navLinkClass = (active = false) =>
  `pg-nav-link px-4 py-2 text-sm font-medium ${active ? 'pg-nav-link--active' : ''}`

/** 目前頁面＝該連結（比對檔名；首頁 './' 不會命中任何主導覽項） */
const isActive = (href: string) => {
  if (typeof window === 'undefined') return false
  const page = window.location.pathname.split('/').pop() || 'index.html'
  return href.replace('./', '') === page
}

/** 舊首頁 solid-dark 的預設底色（與 Hero 同色）；區塊可用 data-nav-dark 指定自己的色值 */
const DEFAULT_DARK_BG = '#0f1e33'

/**
 * 主導覽列。
 *
 * theme='hero'（舊首頁 home-legacy）：導覽列會跟著「身後是哪一個深色區塊」走。
 * 任何區塊只要加上 `data-nav-dark="#色碼"`，導覽列捲到它上方時就會變成 solid-dark，
 * 且底色直接採用該區塊自己的色值。離開最後一個深色區塊後切回 solid-light（page）。
 * 判定方式：量測「導覽列底線」這條水平線落在哪個區塊身上（rAF 節流的 scroll listener，
 * 不用 IntersectionObserver——它在分頁不可見時不會回呼，無法在自動化環境驗證）。
 *
 * glass（premium 首頁）：Adobe-inspired dual state——
 *   State A（scrollY < 24）：transparent-light，透明、全寬，屬於 Hero 攝影
 *   State B（離開頂端）：solid-light + floating surface（.pg-nav-floating）
 * 用 fixed 而非 sticky：首頁 Hero 是 100svh 滿屏，sticky 會把它往下推 64px。
 * 功能（導覽、購物車、登入、語言、手機漢堡）與其他頁完全相同。
 */
export function Navbar({
  theme = 'light',
  glass = false,
}: { theme?: NavTheme; glass?: boolean } = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useSession()
  /* 首頁初始就是深色 → 第一幀不會閃白 */
  const [dark, setDark] = useState(theme === 'hero')
  const [darkBg, setDarkBg] = useState(DEFAULT_DARK_BG)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (theme !== 'hero') {
      setDark(false)
      return
    }
    if (glass) {
      const applyGlass = () => setDark(window.scrollY < 24)
      applyGlass()
      window.addEventListener('scroll', applyGlass, { passive: true })
      return () => window.removeEventListener('scroll', applyGlass)
    }
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-nav-dark]'),
    )
    /* 找不到任何深色區塊就退回淺色（安全預設） */
    if (sections.length === 0) {
      setDark(false)
      return
    }

    const apply = () => {
      /* 判定線＝導覽列自己的底線（實測而非寫死 64px：促銷列、1px 下邊框、瀏覽器縮放
         都會讓實際位置不同，寫死會在捲到最頂端時差 1px，剛好判成「沒有任何區塊」） */
      const line = headerRef.current?.getBoundingClientRect().bottom ?? 64
      /* 由後往前找：交界處若同時命中兩區，取 DOM 順序較後者 */
      let active: HTMLElement | null = null
      for (let i = sections.length - 1; i >= 0; i--) {
        const r = sections[i].getBoundingClientRect()
        if (r.top <= line && r.bottom > line) {
          active = sections[i]
          break
        }
      }
      setDark(Boolean(active))
      if (active) setDarkBg(active.dataset.navDark || DEFAULT_DARK_BG)
    }

    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [theme, glass])

  // 開啟手機選單時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  /* state × surface：三種既有行為路徑各自對應 */
  const state: NavState = glass
    ? dark
      ? 'transparent-light'
      : 'solid-light'
    : dark
      ? 'solid-dark'
      : 'solid-light'
  const surface: NavSurface = glass ? (dark ? 'none' : 'floating') : 'page'
  const tone = state === 'transparent-light' || state === 'solid-dark' ? 'dark' : 'light'

  return (
    /* 深淺兩態高度完全相同（h-16），切換不會造成頁面跳動。
       glass：fixed 基底＋floating 修飾（.pg-nav-glass／.pg-nav-floating）；
       其他頁：sticky 白底＋下邊線（solid-dark 時邊線透明、底色由 --nav-dark-bg 決定） */
    <header
      ref={headerRef}
      data-nav-state={state}
      data-nav-surface={surface}
      data-nav-tone={tone}
      className={
        glass
          ? `pg-nav pg-nav-glass z-40 ${surface === 'floating' ? 'pg-nav-floating' : ''}`
          : `pg-nav sticky top-(--promo-h) z-40 border-b transition-colors duration-250 ease-out ${
              state === 'solid-dark' ? 'border-transparent' : 'border-line bg-white'
            }`
      }
      style={
        state === 'solid-dark'
          ? ({ '--nav-dark-bg': darkBg } as React.CSSProperties)
          : undefined
      }
    >
      <div className="site-container flex h-16 items-center justify-between gap-4">
        {/* 左：Logo + 主導覽連結 */}
        <div className="flex min-w-0 items-center gap-4">
          <Logo dark={tone === 'dark'} />
          <nav aria-label="主要導覽" className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={navLinkClass(isActive(item.href))}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 右：我的課程（登入後）、購物車、頭像／登入、語言。
            .pg-nav-utils：購物車與語言只做字／icon 轉 Primary，不加 indicator、不加 hover 底 */}
        <div className="pg-nav-utils hidden items-center gap-1 lg:flex">
          {user && (
            <a href="./my-courses.html" className={navLinkClass(isActive('./my-courses.html'))}>
              我的課程
            </a>
          )}

          {/* 桌機：hover 展開 mini cart */}
          <CartHover />

          {/* 登入後改顯示頭像選單；ml-3 讓頭像與購物車拉開距離 */}
          {user ? (
            <div className="ml-3">
              <AccountMenu user={user} />
            </div>
          ) : (
            <a href={site.loginUrl} className={navLinkClass()}>
              登入／註冊
            </a>
          )}

          <LanguageMenu />
        </div>

        {/* 手機：購物車抽屜 ＋ 頭像（登入後）＋ 漢堡選單。
            順序與桌機一致：購物車在左、頭像在右 */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartDrawerButton />
          {user && (
            <div className="mx-1">
              <AccountMenu user={user} />
            </div>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            className="pg-nav-burger flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 transition-colors duration-250">
              {menuOpen ? (
                <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
              ) : (
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 手機選單：自己擁有白底深字，不受 nav state 影響 */}
      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <nav aria-label="行動版導覽" className="px-4 py-3">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ivory-100"
              >
                {item.label}
              </a>
            ))}
            {/* 手機導覽列放不下按鈕，「我的課程」改列在選單內 */}
            {user && (
              <a
                href="./my-courses.html"
                className="block rounded-lg px-3 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ivory-100"
              >
                我的課程
              </a>
            )}
            {!user && (
              <a
                href={site.loginUrl}
                className="block rounded-lg px-3 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ivory-100"
              >
                登入／註冊
              </a>
            )}

            <div className="mt-2 flex items-center justify-between border-t border-line px-3 pt-3">
              <span className="text-sm text-ink-500">語言</span>
              <LanguageMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
