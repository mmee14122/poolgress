import { site } from '../content/site'

export function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-white py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-bold text-ink-900">{site.brandName}</p>
          <p className="mt-2 text-sm text-ink-400">
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>

        <nav aria-label="頁尾導覽" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {site.legal.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink-600 transition-colors hover:text-brand-600"
            >
              {item.label}
            </a>
          ))}
          {site.social.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-600 transition-colors hover:text-brand-600"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* 手機底部購買列的讓位空間 */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  )
}
