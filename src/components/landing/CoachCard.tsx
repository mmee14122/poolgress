import { coachLabels, coachProfileHref, type PartnerCoach } from '../../data/partner-coaches'

/**
 * 合作教練卡片（2026-09-16 重設計）——首頁 02 區塊與 coaches.html 列表共用。
 *
 * 目標：不點進詳細頁也能回答「教什麼／適合誰／在哪裡怎麼上／從哪裡預約」。
 * 資訊順序固定（三張一致，方便比較）：
 *   照片（4:3，比舊版 4:5 矮，讓下方資訊與按鈕一起進視窗）
 *   → 教學方向（最醒目）→ 姓名 → 一句教學說明 → 2–3 個項目標籤
 *   → 適合對象／授課方式／授課地點 → 主按鈕「查看課程與預約」（實底、永遠可見）
 *
 * 樣式在 styles/coach-card.css（.pg-coach-card 自成根，不依賴 landing/coaches root）。
 * 進場動畫由外層決定（首頁用 fadeUp 的 style，列表頁用 data-on）。
 */
export function CoachCard({
  coach,
  index,
  style,
  eager,
}: {
  coach: PartnerCoach
  index: number
  style?: React.CSSProperties
  eager?: boolean
}) {
  const venueText =
    coach.venues.length === 0
      ? '待補'
      : coach.venues.length === 1
        ? `${coach.venues[0].city}・${coach.venues[0].name}`
        : `${coach.venues[0].city}・${coach.venues[0].name} 等 ${coach.venues.length} 處`

  return (
    <article className="pg-coach-card" style={style}>
      <div className="pg-coach-card__photo">
        <img src={coach.photo} alt={coach.photoAlt} loading={eager ? 'eager' : 'lazy'} />
        {coach.placeholder && <span className="pg-coach-card__badge">{coachLabels.placeholderPhoto}</span>}
      </div>

      <div className="pg-coach-card__body">
        <p className="pg-coach-card__index">0{index + 1}</p>
        <h3 className="pg-coach-card__focus">{coach.focus}</h3>
        <p className="pg-coach-card__name">
          {coach.name}
          {coach.placeholder && <span className="pg-coach-card__ph">{coachLabels.placeholder}</span>}
        </p>
        <p className="pg-coach-card__pitch">{coach.pitch}</p>

        <ul className="pg-coach-card__topics" aria-label="教學項目">
          {coach.topics.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <dl className="pg-coach-card__facts">
          <div>
            <dt>{coachLabels.levels}</dt>
            <dd>{coach.levels}</dd>
          </div>
          <div>
            <dt>{coachLabels.format}</dt>
            <dd>{coach.format}</dd>
          </div>
          <div>
            <dt>{coachLabels.venue}</dt>
            <dd>{venueText}</dd>
          </div>
        </dl>

        <a className="pg-coach-card__cta" href={coachProfileHref(coach.id)}>
          <span>{coachLabels.cta}</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </article>
  )
}
