import { home } from '../../content/home'

/**
 * SECTION 06｜適合誰
 * 讓使用者確認「這是不是做給我這種人的」。
 * 誠實列出現階段不主攻的對象，不過度承諾。
 */
export function S06Fit() {
  const { fit } = home

  return (
    <section id="fit" className="scroll-mt-24 bg-ivory-50 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
        <h2 className="text-2xl sm:text-4xl">
          {fit.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="mt-6 text-ink-500">Poolgress 特別適合：</p>
        <ul className="mt-4 space-y-3">
          {fit.yes.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-card border border-line bg-white px-5 py-4">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 fill-brand-600">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.2 11.4L5.6 10.2 7 8.8l1.8 1.8 4-4 1.4 1.4z" />
              </svg>
              <span className="text-ink-700">{item}的人</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
