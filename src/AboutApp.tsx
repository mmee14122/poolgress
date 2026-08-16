import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { home } from './data/home'

/**
 * 關於 Poolgress（about.html）：品牌長期願景。
 * 原首頁「POOLGRESS 的長期願景」整區移到這裡，文案一字不改。
 * 樣式沿用首頁願景區：深藍底、置中、安靜收斂。
 */
export default function AboutApp() {
  const { about } = home

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-brand-950 py-16 text-white lg:py-24">
          <div className="mx-auto w-full max-w-2xl px-5 text-center sm:px-8">
            <p className="text-sm font-semibold tracking-widest text-brass-300 uppercase">
              {about.eyebrow}
            </p>
            <h1 className="mt-4 text-3xl text-white sm:text-4xl">
              {about.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div className="mt-8 space-y-4 text-white/70">
              {about.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {/* 收尾：獨立區塊樣式 */}
            <p className="mt-10 text-lg leading-relaxed text-white/85">
              {about.hope.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            {/* 頁尾 CTA：沿用首頁 CTA 區塊樣式 */}
            <div className="mt-14 rounded-card border border-white/15 bg-white/5 px-6 py-10 sm:px-10">
              <h2 className="text-xl text-white sm:text-2xl">{about.entry.title}</h2>
              <Button href={about.entry.cta.href} size="lg" className="mt-7">
                {about.entry.cta.label}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer theme="dark" />
    </>
  )
}
