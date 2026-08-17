import { useEffect, useState } from 'react'
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
 * 判定方式：在導覽列底線處放一條 2px 的偵測帶（IntersectionObserver 的 root 範圍），
 * 哪個區塊與這條帶重疊，就用哪個區塊的色。不新增 scroll listener。
 * 視窗高度改變會影響偵測帶位置，因此 resize 時重建 observer。
 */
export function Navbar({ theme = 'light' }: { theme?: NavTheme } = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useSession()
  /* 首頁初始就是深色 → 第一幀不會閃白 */
  const [dark, setDark] = useState(theme === 'hero')
  const [darkBg, setDarkBg] = useState(DEFAULT_DARK_BG)

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

    let io: IntersectionObserver | null = null
    const hits = new Set<HTMLElement>()

    const build = () => {
      io?.disconnect()
      hits.clear()
      /* 偵測帶位置＝導覽列底線（促銷列存在時再往下 32px） */
      const navOffset =
        64 + (document.documentElement.classList.contains('has-promo') ? 32 : 0)
      const bottom = Math.max(0, window.innerHeight - navOffset - 2)
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) hits.add(e.target as HTMLElement)
            else hits.delete(e.target as HTMLElement)
          }
          /* 交界處可能同時命中兩區，取 DOM 順序較後者＝捲動方向上較新的那一區 */
          const active = sections.filter((s) => hits.has(s)).pop()
          setDark(Boolean(active))
          if (active) {
            setDarkBg(active.dataset.navDark || DEFAULT_DARK_BG)
          }
        },
        { rootMargin: `-${navOffset}px 0px -${bottom}px 0px`, threshold: 0 },
      )
      sections.forEach((s) => io!.observe(s))
    }

    build()
    window.addEventListener('resize', build)
    return () => {
      window.removeEventListener('resize', build)
      io?.disconnect()
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
      className={`sticky top-(--promo-h) z-40 border-b transition-colors duration-250 ease-out ${
        dark ? 'nav-hero border-transparent' : 'border-line bg-white'
      }`}
      /* 深色態底色取自身後區塊的 data-nav-dark，兩者永遠同色 */
      style={dark ? { backgroundColor: darkBg } : undefined}
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
