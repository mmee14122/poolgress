import { SafeImage } from '../../ui/SafeImage'
import { coachHref, type Coach } from '../../data/coaches'

/**
 * 合作教練卡片（教練頁 grid 用）。
 *
 * 照片是主角：4:5 直式，缺圖時顯示品牌漸層人像佔位，版面不會崩壞。
 * 整張卡片可點擊前往個別教練頁；hover 僅微微上移＋邊框轉品牌藍。
 */
export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <article className="group h-full">
      <a
        href={coachHref(coach.id)}
        className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-[0_1px_2px_rgba(20,23,26,0.04)] transition duration-200 hover:-translate-y-1 hover:border-brand-500 hover:shadow-[0_8px_20px_rgba(20,23,26,0.07)]"
      >
        {/* 照片：2:1，全卡片共用同一比例（桌機一頁要能同時看到所有教練） */}
        <div className="aspect-[2/1] w-full overflow-hidden bg-ivory-100">
          <SafeImage
            src={coach.photo}
            alt={`${coach.name} 教練照片`}
            className="h-full w-full object-cover"
            fallback={<CoachPhotoFallback />}
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-semibold tracking-wide text-brand-600">{coach.role}</p>
          <h3 className="mt-1 text-lg">{coach.name}</h3>

          {coach.specialties.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {coach.specialties.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          {/* shortBio 刻意不放在卡片上：點進個別教練頁就看得到完整教學理念，
              卡片留給「角色、姓名、專長、場館」等辨識用資訊，桌機才放得下所有教練 */}

          {/* 所在場館：讓人在列表就看得出各教練在哪裡上課 */}
          {coach.venue && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-500">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 fill-ink-400">
                <path d="M12 2a7 7 0 00-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
              </svg>
              <span className="truncate">{coach.venue.name}</span>
            </p>
          )}

          {/* 低調文字連結：卡片本身已是連結，這裡只作視覺提示 */}
          <p
            aria-hidden="true"
            className="mt-auto pt-2 text-sm font-semibold text-brand-700"
          >
            認識教練 →
          </p>
        </div>
      </a>
    </article>
  )
}

/** 教練照片佔位：品牌漸層＋人像剪影 */
export function CoachPhotoFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-600">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-1/3 w-1/3 fill-white/30">
        <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
      </svg>
    </div>
  )
}
