import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Button } from './ui/Button'
import { course } from './data/course-detail'
import { coaches, coachesIntro } from './data/coaches'
import { SafeImage } from './ui/SafeImage'
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
 * 關於教練：教練群列表。
 *
 * 資料來源 src/data/coaches.ts —— 新增教練只要在該檔的 coaches 陣列
 * 加一筆，此頁自動出現新卡片（單人時為單欄大版，多人時自動排列）。
 * 照片放 public/assets/coach/（建議 800×1066，3:4 直式）。
 */
function CoachPage() {
  const multiple = coaches.length > 1

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

      {/* 教練列表：單人時整頁單欄，多人時每位一張橫向卡片 */}
      <div className="mt-12 space-y-16">
        {coaches.map((coach, i) => (
          <article key={coach.id} id={coach.id} className="scroll-mt-24">
            {multiple && (
              <p
                aria-hidden="true"
                className="mb-5 font-logo text-sm font-semibold tracking-widest text-ink-400"
              >
                {String(i + 1).padStart(2, '0')}
              </p>
            )}

            <div className="grid gap-8 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-10">
              {/* 照片（3:4 直式；無圖時品牌漸層佔位） */}
              <div className="w-full max-w-[15rem] overflow-hidden rounded-card bg-gradient-to-br from-brand-900 to-brand-600">
                <div className="aspect-[3/4] w-full">
                  <SafeImage
                    src={coach.photo}
                    alt={`${coach.name} 教練照片`}
                    className="h-full w-full object-cover"
                    fallback={
                      <div className="flex h-full w-full items-center justify-center">
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-16 w-16 fill-white/30">
                          <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                        </svg>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-wide text-brand-600">{coach.title}</p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl">{coach.name}</h2>

                {/* 專長標籤 */}
                {coach.specialties && coach.specialties.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {coach.specialties.map((s) => (
                      <li
                        key={s}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {/* 教學理念 */}
                <blockquote className="mt-6 border-l-4 border-brand-600 pl-4 text-ink-700 italic">
                  「{coach.philosophy}」
                </blockquote>

                {coach.instagram && (
                  <p className="mt-4 text-sm text-ink-500">Instagram：{coach.instagram}</p>
                )}
              </div>
            </div>

            {/* 數據列 */}
            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {coach.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-card border border-line bg-white px-3 py-5 text-center"
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-xl font-bold text-ink-900 sm:text-2xl">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-xs text-ink-500">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* 介紹與經歷 */}
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold">關於教練</h3>
                <div className="mt-3 space-y-3 leading-relaxed text-ink-700">
                  {coach.bio.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold">經歷</h3>
                <ul className="mt-3 space-y-2">
                  {coach.credentials.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-ink-700">
                      <svg
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 fill-brand-600"
                      >
                        <path d="M7.6 14.6L3 10l1.4-1.4 3.2 3.2 8-8L17 5.2z" />
                      </svg>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

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
