import { useEffect, useId, useRef, useState } from 'react'
import { Logo } from './components/Logo'
import { Button } from './ui/Button'
import { isEmail, MIN_PASSWORD_LENGTH } from './lib/validate'
import {
  AFTER_LOGIN_URL,
  requestPasswordReset,
  signInWithPassword,
  signInWithProvider,
  signUpWithPassword,
  type AuthResult,
  type OAuthProvider,
} from './lib/auth'

type Mode = 'login' | 'register' | 'forgot'

const copy: Record<Mode, { title: string; sub: string; submit: string; busy: string }> = {
  login: {
    title: '歡迎回來',
    sub: '登入後繼續你的撞球學習進度。',
    submit: '登入',
    busy: '登入中……',
  },
  register: {
    title: '建立你的 Poolgress 帳號',
    sub: '開始記錄學習進度，完成每一次球桌挑戰。',
    submit: '建立帳號',
    busy: '建立帳號中……',
  },
  forgot: {
    title: '忘記密碼？',
    sub: '輸入你註冊時使用的電子信箱，我們會寄送密碼重設連結給你。',
    submit: '寄送重設連結',
    busy: '寄送中……',
  },
}

/** 表單層級錯誤訊息（不透露帳號是否存在） */
const formErrorText: Record<string, string> = {
  invalid_credentials: '電子信箱或密碼錯誤',
  email_taken: '這個電子信箱已經註冊過了',
  not_configured: '登入服務尚未開通（後端串接中），暫時無法送出。',
  unknown: '登入失敗，請稍後再試',
}

/**
 * 登入／註冊／忘記密碼（同一張卡片切換狀態，共用視覺與版型）。
 *
 * 網址可帶 ?mode=register｜?mode=forgot 直接進入該狀態，
 * 切換時同步更新網址（history.replaceState，不新增歷史項目）。
 *
 * ⚠️ 後端與 OAuth 尚未串接：送出一律由 lib/auth.ts 回傳 not_configured，
 * 不模擬登入成功，也不儲存密碼。
 */
export default function AuthApp() {
  const initialMode = (() => {
    const m = new URLSearchParams(location.search).get('mode')
    return m === 'register' || m === 'forgot' ? m : 'login'
  })()

  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const agreeId = useId()
  const agreeErrorId = `${agreeId}-error`

  useEffect(() => {
    const url = new URL(location.href)
    if (mode === 'login') url.searchParams.delete('mode')
    else url.searchParams.set('mode', mode)
    history.replaceState(null, '', url)
  }, [mode])

  /** 切換模式：清掉錯誤與送出狀態，焦點移到新標題（螢幕閱讀器可感知） */
  const switchTo = (next: Mode) => {
    setMode(next)
    setAttempted(false)
    setFormError(null)
    setSent(false)
    setBusy(false)
    if (next !== 'register') setConfirm('')
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  /* 欄位驗證：只有送出過（attempted）才顯示，使用者重新輸入即清除表單層錯誤 */
  const emailError = !email.trim()
    ? '請輸入電子信箱'
    : !isEmail(email)
      ? '請輸入有效的電子信箱格式'
      : null
  const passwordError = !password
    ? '請輸入密碼'
    : password.length < MIN_PASSWORD_LENGTH
      ? `密碼至少需要 ${MIN_PASSWORD_LENGTH} 個字元`
      : null
  const confirmError = confirm !== password ? '兩次輸入的密碼不一致' : null
  const agreeError = !agreed ? '請先同意服務條款與隱私權政策' : null

  const errors =
    mode === 'forgot'
      ? { email: emailError }
      : mode === 'login'
        ? { email: emailError, password: passwordError }
        : {
            email: emailError,
            password: passwordError,
            confirm: confirmError,
            agree: agreeError,
          }
  const valid = Object.values(errors).every((e) => !e)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    setFormError(null)
    if (!valid || busy) return

    setBusy(true)
    let result: AuthResult
    if (mode === 'login') result = await signInWithPassword(email, password)
    else if (mode === 'register') result = await signUpWithPassword(email, password)
    else result = await requestPasswordReset(email)
    setBusy(false)

    if (result.ok) {
      if (mode === 'forgot') setSent(true)
      else location.href = AFTER_LOGIN_URL
      return
    }
    /* 忘記密碼：即使後端失敗也顯示相同中性訊息，不洩漏信箱是否註冊。
       後端未接上時另外標示，避免看起來像真的寄出了 */
    if (mode === 'forgot' && result.code !== 'not_configured') {
      setSent(true)
      return
    }
    setFormError(formErrorText[result.code] ?? formErrorText.unknown)
  }

  const onProvider = async (provider: OAuthProvider) => {
    setFormError(null)
    const result = await signInWithProvider(provider)
    if (!result.ok) {
      setFormError(
        result.code === 'not_configured'
          ? `${provider === 'apple' ? 'Apple' : 'Google'} 登入尚未開通（OAuth 串接中）。`
          : formErrorText.unknown,
      )
    }
  }

  const text = copy[mode]

  return (
    /* min-h-dvh（非 100vh）：手機鍵盤彈出時版面不會被截掉 */
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-ivory-50">
      <Decor />

      <header className="relative z-10 px-4 py-4 sm:px-6">
        <Logo />
      </header>

      <main className="relative z-10 flex flex-1 items-start justify-center px-4 pt-2 pb-16 sm:px-6 sm:pt-6">
        <div className="w-full max-w-[27.5rem]">
          <div className="rounded-card border border-line bg-white p-6 shadow-sm sm:p-8">
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl outline-none sm:text-3xl"
            >
              {text.title}
            </h1>
            <p className="mt-2 text-sm text-ink-500">{text.sub}</p>

            {sent ? (
              /* 忘記密碼送出後：中性訊息，不透露信箱是否存在 */
              <div className="mt-6">
                <p className="rounded-lg bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-700">
                  如果此信箱已註冊，我們會將密碼重設連結寄到你的信箱。
                </p>
                <div className="mt-6">
                  <Button block size="lg" variant="secondary" onClick={() => switchTo('login')}>
                    返回登入
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-6">
                <div className="space-y-4">
                  <TextField
                    label="電子信箱"
                    type="email"
                    autoComplete="email"
                    placeholder="請輸入電子信箱"
                    value={email}
                    onChange={(v) => {
                      setEmail(v)
                      setFormError(null)
                    }}
                    error={attempted ? errors.email : null}
                  />

                  {mode !== 'forgot' && (
                    <PasswordField
                      label="密碼"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      placeholder="請輸入密碼"
                      value={password}
                      onChange={(v) => {
                        setPassword(v)
                        setFormError(null)
                      }}
                      error={attempted ? errors.password : null}
                    />
                  )}

                  {mode === 'register' && (
                    <PasswordField
                      label="再次輸入密碼"
                      autoComplete="new-password"
                      placeholder="請再次輸入密碼"
                      value={confirm}
                      onChange={(v) => {
                        setConfirm(v)
                        setFormError(null)
                      }}
                      error={attempted ? errors.confirm : null}
                    />
                  )}
                </div>

                {mode === 'login' && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => switchTo('forgot')}
                      className="rounded px-1 py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                    >
                      忘記密碼？
                    </button>
                  </div>
                )}

                {mode === 'register' && (
                  <div className="mt-5">
                    <label htmlFor={agreeId} className="flex items-start gap-2.5 text-sm">
                      <input
                        id={agreeId}
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        aria-invalid={attempted && !!errors.agree ? true : undefined}
                        aria-describedby={
                          attempted && errors.agree ? agreeErrorId : undefined
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
                      />
                      <span className="text-ink-700">
                        我已閱讀並同意
                        <a
                          href="./terms.html"
                          className="font-semibold text-brand-700 underline underline-offset-4"
                        >
                          《服務條款》
                        </a>
                        與
                        <a
                          href="./privacy.html"
                          className="font-semibold text-brand-700 underline underline-offset-4"
                        >
                          《隱私權政策》
                        </a>
                      </span>
                    </label>
                    {attempted && errors.agree && (
                      <p id={agreeErrorId} role="alert" className="mt-1.5 text-sm text-red-700">
                        {errors.agree}
                      </p>
                    )}
                  </div>
                )}

                {formError && (
                  <p
                    role="alert"
                    className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 ring-1 ring-red-200 ring-inset"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 fill-current"
                    >
                      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z" />
                    </svg>
                    {formError}
                  </p>
                )}

                {/* min-w 由固定寬度文字容器維持，切換文字時按鈕不跳動 */}
                <div className="mt-6">
                  <Button block size="lg" type="submit" disabled={busy}>
                    {busy && <Spinner />}
                    {busy ? text.busy : text.submit}
                  </Button>
                </div>

                {mode === 'forgot' ? (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => switchTo('login')}
                      className="rounded px-1 py-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
                    >
                      返回登入
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="my-6 flex items-center gap-3">
                      <span className="h-px flex-1 bg-line" />
                      <span className="text-xs text-ink-500">或使用以下方式繼續</span>
                      <span className="h-px flex-1 bg-line" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <ProviderButton provider="apple" onClick={() => onProvider('apple')} />
                      <ProviderButton provider="google" onClick={() => onProvider('google')} />
                    </div>
                  </>
                )}
              </form>
            )}
          </div>

          {!sent && mode !== 'forgot' && (
            <p className="mt-6 text-center text-sm text-ink-500">
              {mode === 'login' ? '還沒有帳號？' : '已經有帳號？'}
              <button
                type="button"
                onClick={() => switchTo(mode === 'login' ? 'register' : 'login')}
                className="ml-1 rounded px-1 py-1 font-semibold text-brand-700 underline-offset-4 transition-colors hover:text-brand-900 hover:underline"
              >
                {mode === 'login' ? '前往註冊' : '返回登入'}
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

/* ------------------------------------------------------------------ */

type TextFieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string | null
  type?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * 登入頁專用大尺寸欄位（高度 ≥48px，方便手機單手操作）。
 * 錯誤時同時給邊框、圖示化文字與 aria-invalid／aria-describedby，
 * 不只靠顏色表示。
 */
function TextField({ label, value, onChange, error, type = 'text', ...rest }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-1.5 min-h-12 w-full rounded-lg border bg-white px-4 py-3 text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 ${
          error ? 'border-red-400 focus:outline-red-600' : 'border-line focus:outline-brand-600'
        }`}
        {...rest}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}

/** 密碼欄位：右側顯示／隱藏切換，aria-label 隨狀態改變 */
function PasswordField({
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}: Omit<TextFieldProps, 'type'>) {
  const id = useId()
  const errorId = `${id}-error`
  const [shown, setShown] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-12 w-full rounded-lg border bg-white py-3 pr-14 pl-4 text-ink-900 placeholder:text-ink-400 focus:outline-2 focus:outline-offset-1 ${
            error ? 'border-red-400 focus:outline-red-600' : 'border-line focus:outline-brand-600'
          }`}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? '隱藏密碼' : '顯示密碼'}
          aria-pressed={shown}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-ink-500 transition-colors hover:text-brand-700"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            {shown ? (
              /* 眼睛加斜線＝目前顯示中，點擊可隱藏 */
              <path d="M12 6.5c3.8 0 7 2.4 8.5 5.5a11 11 0 01-2.6 3.4l1.5 1.5 -1.4 1.4L3.5 4.9 4.9 3.5l2.7 2.7A10.6 10.6 0 0112 6.5zm0 2a8.6 8.6 0 00-2.9.5l1.5 1.5a3 3 0 013.9 3.9l2 2a9 9 0 002-2.4A7.6 7.6 0 0012 8.5zM3.5 12a11 11 0 013-3.9l2.2 2.2a3.5 3.5 0 004.5 4.5l1.7 1.7c-.9.3-1.9.5-2.9.5-3.8 0-7-2.4-8.5-5z" />
            ) : (
              <path d="M12 5.5c4.3 0 8 2.6 9.5 6.5-1.5 3.9-5.2 6.5-9.5 6.5S4 15.9 2.5 12C4 8.1 7.7 5.5 12 5.5zm0 2C8.8 7.5 6 9.3 4.7 12 6 14.7 8.8 16.5 12 16.5s6-1.8 7.3-4.5C18 9.3 15.2 7.5 12 7.5zm0 1.8a2.7 2.7 0 110 5.4 2.7 2.7 0 010-5.4z" />
            )}
          </svg>
        </button>
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}

/** 欄位錯誤：紅字 + 驚嘆圖示（不單靠顏色） */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-700">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z" />
      </svg>
      {children}
    </p>
  )
}

/** Apple／Google 登入按鈕（官方辨識圖示，非 emoji） */
function ProviderButton({
  provider,
  onClick,
}: {
  provider: OAuthProvider
  onClick: () => void
}) {
  const isApple = provider === 'apple'
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-line bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-ivory-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:bg-ivory-200"
    >
      {isApple ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-ink-900">
          <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.4-1-2.4-3.6zM14.2 5.9c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.7-1.3z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="#4285F4"
            d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"
          />
          <path
            fill="#34A853"
            d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0012 22z"
          />
          <path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 000 9.2z" />
          <path
            fill="#EA4335"
            d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 003.1 7.4L6.4 10c.8-2.3 3-4.1 5.6-4.1z"
          />
        </svg>
      )}
      {isApple ? 'Apple' : 'Google'}
    </button>
  )
}

/** 極淡的球路裝飾：純靜態 SVG，不影響閱讀，不做持續動畫 */
function Decor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#E4EAF3]" />
      <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#E4EAF3]/70" />
      <svg
        viewBox="0 0 200 200"
        className="absolute right-[6%] bottom-[12%] hidden h-40 w-40 lg:block"
      >
        <circle cx="60" cy="140" r="12" fill="#FBF9F5" stroke="#183D6B" strokeWidth="1.5" />
        <circle cx="150" cy="55" r="12" fill="#E8C97A" />
        <line
          x1="72"
          y1="132"
          x2="140"
          y2="63"
          stroke="#183D6B"
          strokeWidth="1.5"
          strokeDasharray="5 6"
          opacity="0.45"
        />
      </svg>
    </div>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 3a9 9 0 019 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
