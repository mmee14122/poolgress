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
        {/* 照片：4:5 直式，全卡片共用同一比例 */}
        <div className="aspect-[4/5] w-full overflow-hidden bg-ivory-100">
          <SafeImage
            src={coach.photo}
            alt={`${coach.name} 教練照片`}
            className="h-full w-full object-cover"
            fallback={<CoachPhotoFallback />}
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold tracking-wide text-brand-600">{coach.role}</p>
          <h3 className="mt-1.5 text-lg">{coach.name}</h3>

          {coach.specialties.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
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

          {coach.shortBio && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-500">
              {coach.shortBio}
            </p>
          )}

          {/* 低調文字連結：卡片本身已是連結，這裡只作視覺提示 */}
          <p
            aria-hidden="true"
            className="mt-4 pt-1 text-sm font-semibold text-brand-700"
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
