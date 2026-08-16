import { SafeImage, CoverFallback } from '../../ui/SafeImage'
import { CoachPhotoFallback } from './CoachCard'
import { courseById } from '../../data/courses'
import { challengeById } from '../../data/challenges'
import type { Coach, CoachSocialLinks } from '../../data/coaches'

/**
 * 教練完整介紹（精選教練區與個別教練頁共用同一份結構）。
 *
 * 每個區塊都有資料才顯示：bio／stats／credentials／socialLinks／
 * courseIds／challengeIds 任一為空就整段隱藏，不留空白底線。
 *
 * heading：精選區在頁面中屬第二層（h2），個別頁則是主標（h1）。
 */
export function CoachProfile({ coach, as = 'h2' }: { coach: Coach; as?: 'h1' | 'h2' }) {
  const Name = as
  const courses = coach.courseIds.map(courseById).filter((c) => c !== undefined)
  const challenges = coach.challengeIds.map(challengeById).filter((c) => c !== undefined)
  const socials = socialEntries(coach.socialLinks)

  return (
    <div>
      <div className="grid gap-8 sm:grid-cols-[15rem_minmax(0,1fr)] sm:gap-10">
        {/* 照片（3:4 直式；無圖時品牌漸層佔位） */}
        <div className="w-full max-w-[15rem] overflow-hidden rounded-card">
          <div className="aspect-[3/4] w-full">
            <SafeImage
              src={coach.photo}
              alt={`${coach.name} 教練照片`}
              className="h-full w-full object-cover"
              fallback={<CoachPhotoFallback />}
            />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wide text-brand-600">{coach.role}</p>
          <Name className="mt-1.5 text-2xl sm:text-3xl">{coach.name}</Name>

          {coach.specialties.length > 0 && (
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

          {coach.philosophy && (
            <blockquote className="mt-6 border-l-4 border-brand-600 pl-4 text-ink-700 italic">
              「{coach.philosophy}」
            </blockquote>
          )}

          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
              {socials.map(([label, value]) => (
                <li key={label}>
                  {label}：{value}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 數據列 */}
      {coach.stats.length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {coach.stats.map((s) => (
            <div key={s.label} className="rounded-card border border-line bg-white px-3 py-5 text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-xl font-bold text-ink-900 sm:text-2xl">{s.value}</span>
                <span className="mt-1 block text-xs text-ink-500">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* 介紹與經歷：兩邊都沒有資料時整段不顯示 */}
      {(coach.bio.length > 0 || coach.credentials.length > 0) && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {coach.bio.length > 0 && (
            <div>
              <h3 className="text-base font-semibold">關於教練</h3>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-700">
                {coach.bio.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {coach.credentials.length > 0 && (
            <div>
              <h3 className="text-base font-semibold">經歷與資格</h3>
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
          )}
        </div>
      )}

      {/* 開設／參與的課程 */}
      {/* 課程與授課場館並排（桌機兩欄，手機上下堆疊） */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
      {courses.length > 0 && (
        <section>
          <h3 className="text-base font-semibold">開設／參與的課程</h3>
          <ul className="mt-4 grid gap-4">
            {courses.map((c) => (
              <li key={c.id}>
                <a
                  href={c.href ?? undefined}
                  className={`flex gap-4 overflow-hidden rounded-card border border-line bg-white p-3 transition ${
                    c.href ? 'hover:-translate-y-0.5 hover:border-brand-500' : 'cursor-default'
                  }`}
                >
                  <span className="w-24 shrink-0 overflow-hidden rounded-lg">
                    <span className="block aspect-video w-full">
                      <SafeImage
                        src={c.cover}
                        alt=""
                        className="h-full w-full object-cover"
                        fallback={<CoverFallback />}
                      />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-ink-500">{c.level}</span>
                    <span className="mt-0.5 block font-semibold text-ink-900">{c.title}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 撞球場館地點：Google Maps 連結填了才可點 */}
      {coach.venue && (
        <section>
          <h3 className="text-base font-semibold">撞球場館地點</h3>
          <div className="mt-4 rounded-card border border-line bg-white p-4">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-brand-600">
                  <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">{coach.venue.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{coach.venue.address}</p>
              </div>
            </div>

            {coach.venue.mapUrl ? (
              <a
                href={coach.venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline hover:underline-offset-4"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3zM5 5h5V3H3v18h18v-7h-2v5H5z" />
                </svg>
                在 Google 地圖開啟
              </a>
            ) : (
              /* ⚠️ 連結未提供時不放假網址，只標示待補 */
              <p className="mt-4 text-xs text-ink-400">
                Google 地圖連結待補（填入 <code>venue.mapUrl</code> 後這裡會變成可點的連結）
              </p>
            )}
          </div>
        </section>
      )}
      </div>

      {/* 對應實戰 Challenge */}
      {challenges.length > 0 && (
        <section className="mt-10">
          <h3 className="text-base font-semibold">對應實戰闖關</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {challenges.map((c) => (
              <li key={c.id}>
                <a
                  href={`./challenges.html?id=${encodeURIComponent(c.id)}`}
                  className="inline-block rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-brand-500 hover:text-brand-700"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** 社群連結轉成「標籤：值」清單，未填的欄位不出現 */
function socialEntries(links: CoachSocialLinks): [string, string][] {
  const labels: Record<keyof CoachSocialLinks, string> = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
    website: '個人網站',
  }
  return (Object.keys(labels) as (keyof CoachSocialLinks)[])
    .filter((k) => links[k])
    .map((k) => [labels[k], links[k] as string])
}
