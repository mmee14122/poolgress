import { course, courseStats } from '../../data/course-detail'

/**
 * 課程資訊列：課程簡介最上方的小型資訊區。
 * 時數／單元數／練習題數由章節資料自動計算（與 Hero、購買卡同源）；
 * 學員數為【待確認】占位。
 */
export function CourseInfo() {
  const { info } = course.intro

  const rows: { icon: string; label: string; value: string; unit?: string }[] = [
    {
      icon: 'M16 11a4 4 0 10-4-4 4 4 0 004 4zm-8 0a4 4 0 10-4-4 4 4 0 004 4zm0 2c-2.7 0-8 1.3-8 4v3h9.5a6 6 0 01-.5-2.4c0-1.6.7-3 1.8-4.1A14 14 0 008 13zm8 0a6 6 0 100 12 6 6 0 000-12z',
      label: '課程學員',
      value: info.students,
      unit: '人',
    },
    {
      icon: 'M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z',
      label: '適合程度',
      value: info.level,
    },
    {
      icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z',
      label: '課程時數',
      value: `約 ${courseStats.hours}`,
      unit: '小時',
    },
    {
      icon: 'M4 4h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm12 .5V21l5-3.2z',
      label: '課程單元數',
      value: String(courseStats.units),
      unit: '個',
    },
    {
      icon: 'M17 4a5 5 0 014.9 6l-1.6 8A3 3 0 0117.4 21a3 3 0 01-2.5-1.4L13.4 17h-2.8l-1.5 2.6A3 3 0 016.6 21a3 3 0 01-2.9-3l-1.6-8A5 5 0 017 4zM9 8H7v2H5v2h2v2h2v-2h2v-2H9zm7 0a1.2 1.2 0 100 2.4A1.2 1.2 0 0016 8zm2.5 3a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z',
      label: '球桌練習題',
      value: String(courseStats.games),
      unit: '個',
    },
    {
      icon: 'M12 5c5 0 9.3 3 11 7-1.7 4-6 7-11 7S2.7 16 1 12c1.7-4 6-7 11-7zm0 3.5A3.5 3.5 0 1012 15.5 3.5 3.5 0 0012 8.5z',
      label: '觀看期限',
      value: info.access,
    },
  ]

  return (
    <section className="pt-8 pb-10 lg:pt-12">
      <h2 className="flex items-center gap-2.5 text-lg">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand-600" />
        課程資訊
      </h2>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 fill-white">
                <path d={row.icon} />
              </svg>
            </span>
            <dt className="text-sm text-ink-500">{row.label}</dt>
            <dd className="text-sm font-semibold text-ink-900">
              {row.value}
              {row.unit && <span className="ml-0.5 font-normal text-ink-500">{row.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
