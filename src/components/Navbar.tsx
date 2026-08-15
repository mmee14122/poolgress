import { useEffect, useState } from 'react'
import { site } from '../content/site'
import { LanguageMenu } from './LanguageMenu'

function Logo() {
  return (
    // 相對路徑：部署在子資料夾（github.io/poolgress/）時也能正確回首頁
    <a href="./" className="flex shrink-0 items-center gap-2 py-2">
      {/* 母球與撞擊線，兼作 favicon 的雛形 */}
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-felt-900">
        <span className="h-3.5 w-3.5 rounded-full bg-ivory-50" />
        <span className="absolute right-1 bottom-1.5 h-1.5 w-1.5 rounded-full bg-brass-400" />
      </span>
      <span className="text-lg font-bold tracking-tight text-ink-900">{site.brandName}</span>
    </a>
  )
}

function CartIcon({ count }: { count: number }) {
  return (
    <a
      href={site.cartUrl}
      aria-label={`購物車，${count} 件商品`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-700">
        <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM6.2 6h14.4l-2.1 7.3a2 2 0 01-1.9 1.4H8.6a2 2 0 01-1.9-1.4L4.3 4.6H1.8V2.6h4l.4 1.4z" />
      </svg>
      {count > 0 && (
        <span className="absolute top-1 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-felt-600 px-1 text-[0.6875rem] font-bold text-white tabular-nums">
          {count}
        </span>
      )}
    </a>
  )
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  // 開啟手機選單時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        {/* 桌機導覽 */}
        <nav aria-label="主要導覽" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ivory-100 hover:text-ink-900"
            >
              {item.label}
            </a>
          ))}

          <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />

          <CartIcon count={site.cartCount} />

          <a
            href={site.loginUrl}
            className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ivory-100 hover:text-ink-900"
          >
            登入／註冊
          </a>

          <LanguageMenu />
        </nav>

        {/* 手機：僅保留購物車與漢堡選單 */}
        <div className="flex items-center gap-1 lg:hidden">
          <CartIcon count={site.cartCount} />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-ink-900">
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
            <a
              href={site.loginUrl}
              className="block rounded-lg px-3 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-ivory-100"
            >
              登入／註冊
            </a>

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
