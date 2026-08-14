import { site } from '../content/site'
import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="text-base font-bold text-white">
          {site.brandName}
        </a>

        <nav aria-label="主要導覽" className="hidden items-center gap-7 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* 手機版靠 StickyBar 提供 CTA，這裡收起來避免導覽列過擠 */}
        <Button href={site.checkoutUrl} className="hidden sm:inline-flex">
          立即報名
        </Button>
      </div>
    </header>
  )
}
