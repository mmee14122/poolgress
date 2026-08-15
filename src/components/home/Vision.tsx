import { home } from '../../content/home'

/**
 * 品牌願景。刻意放在課程區之後，不阻斷前面的轉換路徑。
 * 語氣安靜，視覺收斂。
 */
export function Vision() {
  const { vision } = home

  return (
    <section id="vision" className="scroll-mt-24 bg-felt-950 py-16 text-white lg:py-20">
      <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
        <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
          Poolgress 的長期願景
        </p>
        <h2 className="mt-4 text-2xl text-white sm:text-3xl">{vision.title}</h2>
        <div className="mt-6 space-y-3 text-white/70">
          {vision.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
