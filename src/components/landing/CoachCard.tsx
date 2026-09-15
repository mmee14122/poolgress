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
 * 整張卡都可點（主按鈕用 stretched-link 覆蓋整張卡），hover 時照片放大、浮出「查看教練頁 ↗」、
 * 主按鈕加深——讓人一看就知道點照片會進教練頁（2026-09-16 使用者）。
 * compact＝首頁用：不顯示「適合對象／授課方式／授課地點」三行，也不顯示「查看課程與預約」按鈕
 *（2026-09-16 使用者）；連結仍在（視覺隱藏、鍵盤與讀屏可用），整張卡靠 hover 提示可點。列表頁維持完整。
 *
 * 樣式在 styles/coach-card.css（.pg-coach-card 自成根，不依賴 landing/coaches root）。
 * 進場動畫由外層決定（首頁用 fadeUp 的 style，列表頁用 data-on）。
 */
export function CoachCard({
  coach,
  style,
  eager,
  compact,
  nameFirst,
}: {
  coach: PartnerCoach
  style?: React.CSSProperties
  eager?: boolean
  compact?: boolean
  /** 列表頁：大字放姓名（原標題位置），教學方向改成小字那行（2026-09-16 使用者） */
  nameFirst?: boolean
}) {
  const venueText =
    coach.venues.length === 0
      ? '待補'
      : coach.venues.length === 1
        ? `${coach.venues[0].city}・${coach.venues[0].name}`
        : `${coach.venues[0].city}・${coach.venues[0].name} 等 ${coach.venues.length} 處`

  return (
    <article className="pg-coach-card" style={style} data-compact={compact ? '1' : '0'}>
      <div className="pg-coach-card__photo">
        <img src={coach.photo} alt={coach.photoAlt} loading={eager ? 'eager' : 'lazy'} />
        {coach.placeholder && <span className="pg-coach-card__badge">{coachLabels.placeholderPhoto}</span>}
        {/* hover 時浮出的提示：整張卡可點 */}
        <span className="pg-coach-card__hint" aria-hidden="true">
          {coachLabels.hoverHint}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8.5 7H17v8.5" />
          </svg>
        </span>
      </div>

      <div className="pg-coach-card__body">
        <h3 className="pg-coach-card__focus">
          {nameFirst ? coach.name : coach.focus}
          {nameFirst && coach.placeholder && <span className="pg-coach-card__ph">{coachLabels.placeholder}</span>}
        </h3>
        <p className="pg-coach-card__name">
          {nameFirst ? coach.focus : coach.name}
          {!nameFirst && coach.placeholder && <span className="pg-coach-card__ph">{coachLabels.placeholder}</span>}
        </p>
        <p className="pg-coach-card__pitch">{coach.pitch}</p>

        <ul className="pg-coach-card__topics" aria-label="教學項目">
          {coach.topics.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {!compact && (
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
        )}

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
