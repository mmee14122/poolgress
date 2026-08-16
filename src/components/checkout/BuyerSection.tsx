import { ChoiceCard, Field, TextInput } from '../../ui/Field'
import { Button } from '../../ui/Button'
import type { BuyerMode, FieldErrors } from '../../lib/checkout'

type Props = {
  mode: BuyerMode
  onMode: (m: BuyerMode) => void
  memberLoggedIn: boolean
  memberEmail: string
  /** 示範登入：正式版接 OAuth／帳密登入流程 */
  onDemoLogin: () => void
  guest: { email: string; name: string; phone: string }
  onGuest: (g: { email: string; name: string; phone: string }) => void
  errors: FieldErrors
  /** 是否已按過確認購買 */
  attempted: boolean
}

/** 結帳第一步：會員購買或非會員購買，兩張卡片擇一，選中高亮 */
export function BuyerSection({
  mode,
  onMode,
  memberLoggedIn,
  memberEmail,
  onDemoLogin,
  guest,
  onGuest,
  errors,
  attempted,
}: Props) {
  /* 格式錯誤在欄位有內容時立即顯示；「必填未填」由訂單明細的缺漏摘要提示 */
  /* 未填欄位在使用者按下確認購買（attempted）後也要顯示錯誤，
     否則空欄位沒有任何提示，也無法被捲動聚焦 */
  const err = (k: string, value: string) =>
    attempted || value.trim() ? (errors[k] ?? null) : null

  return (
    <section aria-labelledby="buyer-heading">
      <h2 id="buyer-heading" className="text-lg">
        購買方式
      </h2>

      <div className="mt-4 space-y-3">
        <ChoiceCard
          name="buyer-mode"
          value="guest"
          checked={mode === 'guest'}
          onChange={() => onMode('guest')}
          title="非會員購買"
          description="不需註冊即可購買；付款後可透過 Email 存取課程，之後也能建立帳號並自動綁定訂單。"
        >
          <div className="space-y-4">
            <Field label="Email" required error={err('guestEmail', guest.email)} hint="作為訂單通知、課程存取及未來帳號綁定依據">
              {(id, invalid) => (
                <TextInput
                  id={id}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={guest.email}
                  invalid={invalid}
                  onChange={(e) => onGuest({ ...guest, email: e.target.value })}
                />
              )}
            </Field>
            <Field label="姓名" required error={err('guestName', guest.name)}>
              {(id, invalid) => (
                <TextInput
                  id={id}
                  autoComplete="name"
                  placeholder="王小明"
                  value={guest.name}
                  invalid={invalid}
                  onChange={(e) => onGuest({ ...guest, name: e.target.value })}
                />
              )}
            </Field>
            <Field label="聯絡電話" error={err('guestPhone', guest.phone)} hint="選填；依金流需求可能改為必填">
              {(id, invalid) => (
                <TextInput
                  id={id}
                  type="tel"
                  autoComplete="tel"
                  placeholder="0912345678"
                  value={guest.phone}
                  invalid={invalid}
                  onChange={(e) => onGuest({ ...guest, phone: e.target.value })}
                />
              )}
            </Field>
          </div>
        </ChoiceCard>

        <ChoiceCard
          name="buyer-mode"
          value="member"
          checked={mode === 'member'}
          onChange={() => onMode('member')}
          title="會員購買"
          description="登入後可保存學習進度、查看訂單與永久管理已購課程。"
        >
          {memberLoggedIn ? (
            <p className="flex items-center gap-2 text-sm text-ink-700">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-brand-600">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1.2 11.4L5.6 10.2 7 8.8l1.8 1.8 4-4 1.4 1.4z" />
              </svg>
              目前登入帳號：<strong className="font-semibold text-ink-900">{memberEmail}</strong>
            </p>
          ) : (
            <div>
              {/* 示範：點擊直接以示範帳號登入。正式版導向登入／註冊流程 */}
              <Button onClick={onDemoLogin}>登入／註冊後購買</Button>
              {errors.member && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                  {errors.member}
                </p>
              )}
              <p className="mt-2 text-xs text-ink-400">＊示範環境：點擊即以示範帳號登入</p>
            </div>
          )}
        </ChoiceCard>
      </div>
    </section>
  )
}
