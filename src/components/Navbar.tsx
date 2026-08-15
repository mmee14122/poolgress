import { useEffect, useState } from 'react'
import { site } from '../content/site'
import { LanguageMenu } from './LanguageMenu'
import { CartHover, CartDrawerButton } from './cart/CartWidget'
import { Logo } from './Logo'
import { AccountMenu } from './AccountMenu'
import { useSession } from '../lib/session'


type NavTheme = 'light' | 'hero'

/** 導覽連結樣式：深色態白字、hover 轉品牌金；兩態尺寸完全相同 */
const navLinkClass = (dark: boolean) =>
  `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-250 ${
    dark
      ? 'text-white/85 hover:bg-white/10 hover:text-brass-300'
      : 'text-ink-700 hover:bg-ivory-100 hover:text-ink-900'
  }`

/**
 * 主導覽列。
 *
 * theme='hero'（僅首頁）：載入時即為深色（與 Hero 同一個 brand-950），
 * 並以 Hero 底部的 sentinel + IntersectionObserver 判斷是否已離開 Hero，
 * 離開後平滑切回淺色，捲回時自動變深。不新增 scroll listener。
 * 其他頁面不傳 theme，維持原本淺色。
 */
export function Navbar({ theme = 'light' }: { theme?: NavTheme } = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useSession()
  /* 首頁初始就是深色 → 第一幀不會閃白 */
  const [dark, setDark] = useState(theme === 'hero')

  useEffect(() => {
    if (theme !== 'hero') {
      setDark(false)
      return
    }
    /* Hero 尚未掛載完成時重試一次；仍找不到就退回淺色（安全預設） */
    const sentinel = document.getElementById('hero-end')
    if (!sentinel) {
      setDark(false)
      return
    }

    /* sentinel 位於 Hero 底部且有 16px 高度＝遲滯範圍：
       交界處小幅上下捲動不會反覆切換。
       上邊界扣掉導覽列高度，讓切換點落在導覽列底線；
       下邊界放大，確保 sentinel 遠在畫面下方時仍判定為「still in hero」 */
    const navOffset = 64 + (document.documentElement.classList.contains('has-promo') ? 32 : 0)
    const io = new IntersectionObserver(
      ([entry]) => setDark(entry.isIntersecting),
      { rootMargin: `-${navOffset}px 0px 100000px 0px`, threshold: 0 },
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [theme])

  // 開啟手機選單時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    /* 背景用純色：backdrop-filter 在捲動時整條列逐幀重繪，是滾動卡頓來源之一。
       深淺兩態高度完全相同（h-16），切換不會造成頁面跳動。 */
    <header
      className={`sticky top-(--promo-h) z-40 border-b transition-colors duration-250 ease-out ${
        dark ? 'nav-hero border-transparent bg-brand-950' : 'border-line bg-white'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
        {/* 左：Logo + 主導覽連結 */}
        <div className="flex min-w-0 items-center gap-4">
          <Logo dark={dark} />
          <nav aria-label="主要導覽" className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={navLinkClass(dark)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 右：我的課程（登入後）、購物車、頭像／登入、語言 */}
        <div className="hidden items-center gap-1 lg:flex">
          {user && (
            <a href="./my-courses.html" className={navLinkClass(dark)}>
              我的課程
            </a>
          )}

          {/* 桌機：hover 展開 mini cart */}
          <CartHover />

          {/* 登入後改顯示頭像選單 */}
          {user ? (
            <AccountMenu user={user} />
          ) : (
            <a href={site.loginUrl} className={navLinkClass(dark)}>
              登入／註冊
            </a>
          )}

          <LanguageMenu />
        </div>

        {/* 手機：頭像（登入後）＋購物車抽屜 + 漢堡選單 */}
        <div className="flex items-center gap-1 lg:hidden">
          {user && <AccountMenu user={user} />}
          <CartDrawerButton />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-6 w-6 transition-colors duration-250 ${dark ? "fill-white" : "fill-ink-900"}`}>
              {menuOpen ? (
                <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4z M19 6.4L6.4 19 5 17.6 17.6 5z" />
              ) : (
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              )}
            </svg>
          </button>
        </div>
      </div>

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
            {/* 已登入時個人相關入口由頭像選單負責，這裡只補「我的課程」 */}
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
