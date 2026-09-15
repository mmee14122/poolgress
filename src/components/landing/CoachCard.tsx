import { coachLabels, coachProfileHref, type PartnerCoach } from '../../data/partner-coaches'

/**
 * 合作教練卡片（2026-09-16 重設計）——首頁 02 區塊與 coaches.html 列表共用。
 *
 * 目標：不點進詳細頁也能回答「教什麼／適合誰／在哪裡怎麼上／從哪裡預約」。
 * 資訊順序固定（三張一致，方便比較）：
 *   照片 → 教學方向（或姓名，nameFirst）→ 姓名（或教學方向）→ 一句教學說明 → 2–3 個項目標籤
 *   → 適合對象／授課方式／授課地點（compact 不顯示）→ 底部「查看課程與預約」（compact 不顯示）
 *
 * 互動（2026-09-16 使用者規格）：整張卡是**單一 <a>**，沒有巢狀連結或按鈕；
 * hover／focus-visible 時整卡同步：藍灰外框、淡陰影、上移 3px、照片在容器內放大 1.02、
 * 底部入口變深藍灰底米白字；內文不動。照片上不再有浮動按鈕或遮罩。
 * 外框預先保留（透明 1px），hover 不會改變尺寸或推動鄰卡。手機不靠 hover，點一下即進入。
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
  /** 首頁：不顯示三行小資訊與底部入口（2026-09-16 使用者） */
  compact?: boolean
  /** 列表頁：大字放姓名，教學方向改成小字那行（2026-09-16 使用者） */
  nameFirst?: boolean
}) {
  const venueText =
    coach.venues.length === 0
      ? '待補'
      : coach.venues.length === 1
        ? `${coach.venues[0].city}・${coach.venues[0].name}`
        : `${coach.venues[0].city}・${coach.venues[0].name} 等 ${coach.venues.length} 處`

  return (
    <a
      className="pg-coach-card"
      href={coachProfileHref(coach.id)}
      style={style}
      data-compact={compact ? '1' : '0'}
      aria-label={`${coach.name}：${coach.focus}，${coachLabels.cta}`}
    >
      <div className="pg-coach-card__photo">
        <img src={coach.photo} alt={coach.photoAlt} loading={eager ? 'eager' : 'lazy'} />
        {coach.placeholder && <span className="pg-coach-card__badge">{coachLabels.placeholderPhoto}</span>}
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

        {/* 底部入口：純顯示（整張卡就是連結），不再是第二個 <a> */}
        {!compact && (
          <span className="pg-coach-card__cta" aria-hidden="true">
            <span>{coachLabels.cta}</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
      </div>
    </a>
  )
}
