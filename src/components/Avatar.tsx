import { initialOf, type Session } from '../lib/session'

/**
 * 使用者頭像：有上傳圖片時顯示圖片，否則顯示名稱首字。
 * 外圈細環（品牌色）與參考設計一致；尺寸由 className 指定。
 */
export function Avatar({
  user,
  className = 'h-10 w-10 text-sm',
  ring = true,
}: {
  user: Session
  className?: string
  ring?: boolean
}) {
  const base = `flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 font-bold text-white ${
    ring ? 'ring-2 ring-brand-200' : ''
  } ${className}`

  if (user.avatar) {
    return (
      <span className={base}>
        <img src={user.avatar} alt="" className="h-full w-full object-cover" />
      </span>
    )
  }
  return <span className={base}>{initialOf(user)}</span>
}
