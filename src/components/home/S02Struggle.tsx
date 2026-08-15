import { home } from '../../data/home'

/**
 * SECTION 02｜困境
 * 只負責描述問題，不解決。使用者看完應該想：「對，我就是這樣。」
 */
export function S02Struggle() {
  const { struggle } = home

  return (
    <section id="struggle" className="scroll-mt-24 bg-ivory-50 py-16 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <h2 className="text-2xl sm:text-4xl">
          {struggle.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <div className="mt-8 space-y-1.5 text-lg text-ink-700">
          {struggle.story.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p className="mt-6 text-lg text-ink-700">{struggle.quote}</p>

        {/* 連自己哪裡有問題都不知道 */}
        <div className="mt-8 rounded-card border border-line bg-white p-6 sm:p-7">
          <p className="text-ink-700">{struggle.unknowns.lead}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {struggle.unknowns.items.map((item) => (
              <li key={item} className="flex items-center gap-3 text-ink-500">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ivory-100 text-sm font-bold text-ink-400"
                >
                  ?
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-ink-700">{struggle.unknowns.close}</p>
        </div>

        <div className="mt-10">
          <p className="text-lg text-ink-500">{struggle.ending[0]}</p>
          <p className="mt-2 border-l-4 border-brass-400 pl-5 text-2xl leading-snug font-bold text-ink-900 sm:text-3xl">
            {struggle.ending[1]}
          </p>
        </div>
      </div>
    </section>
  )
}
