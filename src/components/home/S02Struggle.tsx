import { home } from '../../content/home'

/**
 * SECTION 02｜困境
 * 任務只有一個：讓使用者覺得「對，這就是我」。不給答案。
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

        {/* 進了／沒進 對照 */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-card border border-line bg-white p-6 text-center">
            <p className="text-sm text-ink-500">{struggle.contrast.left.title}</p>
            <p className="mt-2 text-2xl font-bold text-felt-600">{struggle.contrast.left.text}</p>
          </div>
          <div className="rounded-card border border-line bg-white p-6 text-center">
            <p className="text-sm text-ink-500">{struggle.contrast.right.title}</p>
            <p className="mt-2 text-2xl font-bold text-ink-400">{struggle.contrast.right.text}</p>
          </div>
        </div>

        <p className="mt-10 text-lg text-ink-500">所以打了一次又一次，最後還是：</p>
        <p className="mt-2 text-xl font-semibold text-ink-900">{struggle.ending}</p>

        <p className="mt-12 border-l-4 border-brass-400 pl-5 text-2xl font-bold text-ink-900 sm:text-3xl">
          {struggle.question}
        </p>
      </div>
    </section>
  )
}
