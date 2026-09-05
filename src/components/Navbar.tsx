import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
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

/** 深色態預設底色（與 Hero 同色）；區塊可用 data-nav-dark 指定自己的色值 */
const DEFAULT_DARK_BG = '#0f1e33'

/**
 * 主導覽列。
 *
 * theme='hero'（僅首頁）：導覽列會跟著「身後是哪一個深色區塊」走。
 *
 * 任何區塊只要加上 `data-nav-dark="#色碼"`，導覽列捲到它上方時就會變成深色，
 * 且底色直接採用該區塊自己的色值 —— 所以導覽列與身後背景永遠是相近的顏色，
 * 不會出現「深藍區塊上壓著另一個更深的深藍長條」。離開最後一個深色區塊後切回白色。
 *
 * 判定方式：直接量測「導覽列底線」這條水平線落在哪個區塊身上（getBoundingClientRect）。
 *
 * 為什麼不用 IntersectionObserver：它的回呼在分頁不可見時完全不會送出，
 * 導致無法在自動化環境中驗證，也曾造成首頁一載入就誤判成淺色。
 * 這裡改用 rAF 節流的 scroll listener，每幀最多算一次、只讀兩個矩形，
 * 判定與捲動位置同步且可被直接量測驗證。
 */
/**
 * glass（僅 premium 首頁）：透明玻璃變體。
 * - 深色態：不用實色底，改成「上深下透明」的漸層壓在 Hero 影像上
 * - 淺色態：米白 82% 半透明＋backdrop-blur（與首頁玻璃卡同語言），不是純白
 * - 用 fixed 而非 sticky：首頁 Hero 是 100svh 滿屏，sticky 會把它往下推 64px
 * 功能（導覽、購物車、登入、語言、手機漢堡）與其他頁完全相同。
 * 註：backdrop-filter 捲動時會逐幀重繪，這是使用者為首頁選的視覺（方案 B），
 * 其他 28 頁仍走純色底、不受影響。
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
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-nav-dark]'),
    )
    /* 找不到任何深色區塊就退回淺色（安全預設） */
    if (sections.length === 0) {
      setDark(false)
      return
    }

    const apply = () => {
      /* 判定線＝導覽列自己的底線（實測而非寫死 64px：
         促銷列高度、1px 下邊框、瀏覽器縮放都會讓實際位置不同，
         寫死會在捲到最頂端時差 1px，剛好判成「沒有任何區塊」＝白色） */
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

    /* 不套 requestAnimationFrame：rAF 在分頁不可見時不會執行，會讓判定停在舊值，
       而且瀏覽器本來就把 scroll 事件對齊到每幀最多一次。
       每次只讀 3 個矩形、不寫入樣式，不會觸發額外的版面重算。 */
    apply()
    window.addEventListener('scroll', apply, { passive: true })
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
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
      ref={headerRef}
      className={
        glass
          ? `fixed inset-x-0 top-0 z-40 transition-colors duration-250 ease-out ${
              dark ? 'nav-hero' : 'pg-nav-glass-light'
            }`
          : `sticky top-(--promo-h) z-40 border-b transition-colors duration-250 ease-out ${
              dark ? 'nav-hero border-transparent' : 'border-line bg-white'
            }`
      }
      /* 深色態底色取自身後區塊的 data-nav-dark，兩者永遠同色；glass 改用透明漸層 */
      style={
        dark
          ? glass
            ? { background: 'linear-gradient(to bottom, rgba(37,44,48,.55), transparent)' }
            : { backgroundColor: darkBg }
          : undefined
      }
    >
      <div className="site-container flex h-16 items-center justify-between gap-4">
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

          {/* 登入後改顯示頭像選單；ml-3 讓頭像與購物車拉開距離 */}
          {user ? (
            <div className="ml-3">
              <AccountMenu user={user} />
            </div>
          ) : (
            <a href={site.loginUrl} className={navLinkClass(dark)}>
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
