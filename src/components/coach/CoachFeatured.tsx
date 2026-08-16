import { SafeImage } from '../../ui/SafeImage'
import { CoachPhotoFallback } from './CoachCard'
import { coachHref, type Coach } from '../../data/coaches'

/**
 * 精選（首席）教練：教練頁上方的橫式介紹卡。
 *
 * 刻意保持精簡——桌機一頁就要能同時看到首席與所有合作教練，
 * 所以只放照片、角色、姓名、專長、一句理念與數據；
 * 完整的關於教練／經歷／課程留在個別教練頁（CoachProfile）。
 * 比合作教練卡片大一級即可，不要拉開太懸殊的比例。
 */
export function CoachFeatured({ coach }: { coach: Coach }) {
  return (
    <article className="group overflow-hidden rounded-card border border-line bg-white shadow-[0_1px_2px_rgba(20,23,26,0.04)] transition duration-200 hover:border-brand-500">
      <a href={coachHref(coach.id)} className="flex flex-col sm:flex-row">
        {/* 照片：手機 16:9 橫幅、桌機固定 13rem 寬直式 */}
        <div className="aspect-video w-full shrink-0 overflow-hidden bg-ivory-100 sm:aspect-auto sm:w-52">
          <SafeImage
            src={coach.photo}
            alt={`${coach.name} 教練照片`}
            className="h-full w-full object-cover"
            fallback={<CoachPhotoFallback />}
          />
        </div>

        <div className="min-w-0 flex-1 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="rounded-full bg-brass-400/15 px-2.5 py-1 text-xs font-bold text-brass-700">
              精選教練
            </span>
            <span className="text-sm font-semibold tracking-wide text-brand-600">{coach.role}</span>
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl">{coach.name}</h2>

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

          {coach.philosophy && (
            <p className="mt-2.5 line-clamp-1 border-l-4 border-brand-600 pl-3 text-sm leading-relaxed text-ink-700 italic">
              「{coach.philosophy}」
            </p>
          )}

          {/* 數據：橫排文字，不做成大方塊，避免佔掉整個畫面高度 */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {coach.stats.length > 0 && (
              <dl className="flex flex-wrap gap-x-5 gap-y-2">
                {coach.stats.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <dt className="text-xs text-ink-500">{s.label}</dt>
                    <dd className="text-sm font-semibold text-ink-900 tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <span aria-hidden="true" className="text-sm font-semibold text-brand-700">
              認識教練 →
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}
