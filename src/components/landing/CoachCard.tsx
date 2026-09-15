import { coachLabels, coachProfileHref, type PartnerCoach } from '../../data/partner-coaches'

/**
 * 合作教練卡片（2026-09-16 第三版，使用者規格）——首頁 02 區塊與 coaches.html 列表共用。
 *
 * 先呈現學習路徑，再呈現教練：每張卡最上面是層級標示（01 — START／02 — IMPROVE／03 — COMPETE），
 * 使用者不用讀介紹就知道「入門 → 進階 → 實戰」。人物照片放大到約占卡片 55–60% 高，成為主視覺。
 * 常態只留：層級／教練名稱／教學定位／3 個技能 tag／適合對象。授課方式、地點移到詳細頁。
 *
 * 整張卡是單一 <a>（無巢狀連結）。桌機 hover：照片 1.03、極淡深色 overlay、右下角淡入「查看課程與預約 ↗」，
 * 300ms、無粗框；不改尺寸、不造成 layout shift。手機沒有 hover：文字區最後放低調的「查看課程與預約 ↗」文字連結。
 * 樣式在 styles/coach-card.css（.pg-coach-card 自成根）。
 */
export function CoachCard({
  coach,
  index,
  style,
  eager,
}: {
  coach: PartnerCoach
  /** 0/1/2 → 01 START／02 IMPROVE／03 COMPETE */
  index: number
  style?: React.CSSProperties
  eager?: boolean
}) {
  const level = coachLabels.levels3[index] ?? coachLabels.levels3[coachLabels.levels3.length - 1]

  return (
    <a
      className="pg-coach-card"
      href={coachProfileHref(coach.id)}
      style={style}
      aria-label={`${level.en}／${level.zh}：${coach.name}，${coach.focus}，${coachLabels.cta}`}
    >
      {/* 層級標示：學習路徑優先 */}
      <p className="pg-coach-card__level">
        <span className="pg-coach-card__level-no">{level.no}</span>
        <span className="pg-coach-card__level-sep" aria-hidden="true">—</span>
        <span className="pg-coach-card__level-en">{level.en}</span>
        <span className="pg-coach-card__level-zh">{level.zh}</span>
      </p>

      <div className="pg-coach-card__photo">
        <img src={coach.photo} alt={coach.photoAlt} loading={eager ? 'eager' : 'lazy'} />
        {coach.placeholder && <span className="pg-coach-card__badge">{coachLabels.placeholderPhoto}</span>}
        {/* 桌機 hover 才淡入的角落提示（手機隱藏） */}
        <span className="pg-coach-card__peek" aria-hidden="true">
          {coachLabels.cta}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8.5 7H17v8.5" />
          </svg>
        </span>
      </div>

      <div className="pg-coach-card__body">
        <h3 className="pg-coach-card__name">
          {coach.name}
          {coach.placeholder && <span className="pg-coach-card__ph">{coachLabels.placeholder}</span>}
        </h3>
        <p className="pg-coach-card__focus">{coach.focus}</p>

        <ul className="pg-coach-card__topics" aria-label="教學項目">
          {coach.topics.slice(0, 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <p className="pg-coach-card__fit">
          <span className="pg-coach-card__fit-label">{coachLabels.levels}</span>
          {coach.levels}
        </p>

        {/* 手機：低調的文字連結（桌機隱藏，桌機靠 hover 提示） */}
        <span className="pg-coach-card__more" aria-hidden="true">
          {coachLabels.cta} ↗
        </span>
      </div>
    </a>
  )
}
