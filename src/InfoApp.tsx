import { useMemo, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { course } from './data/course-detail'
import { coachById, coachesIntro, featured, partners, partnersIntro } from './data/coaches'
import { CoachCard } from './components/coach/CoachCard'
import { CoachProfile } from './components/coach/CoachProfile'
import { site } from './data/site'

export type InfoPage = 'coach' | 'faq' | 'contact'

/**
 * 支援頁：關於教練（coach.html）／常見問題（faq.html）／聯絡我們（contact.html）。
 * 教練與 FAQ 資料來自 src/content/course.ts（改那裡即可，課程頁同步更新）；
 * 聯絡信箱來自 src/content/site.ts 的 contactEmail。
 */
export default function InfoApp({ page }: { page: InfoPage }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        {page === 'coach' && <CoachPage />}
        {page === 'faq' && <FaqPage />}
        {page === 'contact' && <ContactPage />}
      </main>
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */


/**
 * 關於教練。
 *
 * 同一個進入點兩種畫面：
 *   coach.html          → 教練群（精選教練完整介紹 ＋ 合作教練 grid）
 *   coach.html?id=xxx   → 個別教練頁（與精選區共用 CoachProfile 模板）
 *
 * 資料來源 src/data/coaches.ts —— 新增教練只要在該檔加一筆，
 * 卡片與個別頁都自動生效，不必新增檔案。
 * 照片放 public/assets/coach/（卡片 4:5、介紹區 3:4，缺圖時漸層佔位）。
 */
function CoachPage() {
  const id = useMemo(() => new URLSearchParams(location.search).get('id'), [])
  const coach = id ? coachById(id) : undefined

  if (id) return <CoachDetailPage coach={coach} />

  return (
    <>
      {/* 頁首：品牌語氣的導言 */}
      <header className="border-b border-line pb-10">
        <p className="text-sm font-semibold tracking-widest text-brand-600">
          {coachesIntro.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl leading-snug sm:text-4xl">{coachesIntro.title}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-500">{coachesIntro.lead}</p>
      </header>

      {/* 精選教練：完整介紹（只突出一位） */}
      <section id={featured.id} className="mt-12 scroll-mt-24">
        <p className="mb-5 text-sm font-semibold tracking-widest text-ink-400">精選教練</p>
        <CoachProfile coach={featured} />
      </section>

      {/* 合作教練：桌機 3 欄，第 4 位以後自動換列；平板 2 欄、手機單欄 */}
      {partners.length > 0 && (
        <section id="partners" className="mt-16 scroll-mt-24 border-t border-line pt-12">
          <p className="text-sm font-semibold tracking-widest text-brand-600">
            {partnersIntro.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl sm:text-3xl">{partnersIntro.title}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-500">{partnersIntro.lead}</p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((coach) => (
              <li key={coach.id}>
                <CoachCard coach={coach} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 頁尾 CTA */}
      <div className="mt-16 rounded-card bg-brand-950 p-8 text-center sm:p-10">
        <h2 className="text-xl text-white sm:text-2xl">想知道教練怎麼帶你學？</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-white/70">
          課程裡的每一個單元，都是照著這套「講清楚」的方法設計的。
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="./course.html" size="lg">
            查看線上課程
          </Button>
          <Button
            href="./challenges.html"
            size="lg"
            variant="quiet"
            className="border border-white py-[calc(0.875rem-1px)]! text-white hover:bg-white! hover:text-black!"
          >
            實戰闖關
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

/**
 * 個別教練頁（coach.html?id=…）。
 * 首席與合作教練共用同一份 CoachProfile 結構；沒有資料的欄位整段隱藏。
 */
function CoachDetailPage({ coach }: { coach: ReturnType<typeof coachById> }) {
  if (!coach) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="text-2xl sm:text-3xl">找不到這位教練</h1>
        <p className="mt-3 leading-relaxed text-ink-500">
          連結可能已失效，或這位教練尚未公開。
        </p>
        <div className="mt-6">
          <Button href="./coach.html" size="lg">
            回教練群
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 麵包屑：回教練群 */}
      <nav aria-label="麵包屑" className="mb-8">
        <a
          href="./coach.html"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline hover:underline-offset-4"
        >
          <span aria-hidden="true">←</span> 教練群
        </a>
      </nav>

      <CoachProfile coach={coach} as="h1" />

      {/* CTA */}
      <div className="mt-16 rounded-card bg-brand-950 p-8 text-center sm:p-10">
        <h2 className="text-xl text-white sm:text-2xl">想跟著這位教練練習？</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-white/70">
          課程裡的每一個單元，都是照著「把動作講清楚」的方法設計的。
        </p>
        <div className="mt-6">
          <Button href="./course.html" size="lg">
            查看這位教練的課程
          </Button>
        </div>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <>
      <h1 className="text-3xl sm:text-4xl">常見問題</h1>
      <p className="mt-3 text-ink-500">找不到答案？歡迎直接聯絡我們。</p>

      <ul className="mt-8 divide-y divide-line rounded-card border border-line bg-white">
        {course.faqs.map((faq, i) => (
          <li key={faq.q}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink-900 transition-colors hover:bg-ivory-50"
            >
              {faq.q}
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 fill-ink-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
              >
                <path d="M5.3 7.3l4.7 4.7 4.7-4.7 1.4 1.4-6.1 6.1-6.1-6.1z" />
              </svg>
            </button>
            {open === i && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-500">{faq.a}</p>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-ink-500">
        還有其他問題？
        <a href="./contact.html" className="ml-1 font-semibold text-brand-700 underline underline-offset-4">
          聯絡我們
        </a>
      </p>
    </>
  )
}

/* ------------------------------------------------------------------ */

function ContactPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="text-3xl sm:text-4xl">聯絡我們</h1>
      <p className="mt-3 leading-relaxed text-ink-500">
        課程問題、合作提案或任何建議，歡迎來信，我們會盡快回覆。
      </p>

      <div className="mt-8 rounded-card border border-line bg-white p-8">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="mx-auto h-10 w-10 fill-brand-600">
          <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 7L4 6v12h16V6zm0 2.3L20 8v-.7l-8 5-8-5V8z" />
        </svg>
        <p className="mt-4 font-semibold text-ink-900">{site.contactEmail}</p>
        <div className="mt-6">
          <Button href={`mailto:${site.contactEmail}`} size="lg" block>
            寫信給我們
          </Button>
        </div>
        <p className="mt-4 text-xs text-ink-400">
          回覆時間約＿＿個工作天（實際政策待確認）。
        </p>
      </div>

      <p className="mt-8 text-sm text-ink-500">
        也可以先看看
        <a href="./faq.html" className="mx-1 font-semibold text-brand-700 underline underline-offset-4">
          常見問題
        </a>
        ，多數問題都有答案。
      </p>
    </div>
  )
}
