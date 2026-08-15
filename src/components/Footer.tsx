import { site } from '../content/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-bold text-ink-900">{site.brandName}</p>
          <p className="mt-1 text-sm text-ink-400">{site.tagline}</p>
          <p className="mt-3 text-sm text-ink-400">
            © {new Date().getFullYear()} {site.brandName}. All rights reserved.
          </p>
        </div>

        <nav aria-label="頁尾導覽" className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {site.footerLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              /* inline-block + py 讓行動裝置上的觸控區域夠大 */
              className="inline-block py-2.5 text-ink-500 transition-colors hover:text-brand-700"
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
