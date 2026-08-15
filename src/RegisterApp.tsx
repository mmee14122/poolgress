import { useMemo, useRef, useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Field, TextInput } from './ui/Field'
import { Button } from './ui/Button'
import { isEmail } from './lib/validate'

type Step = 'form' | 'verify' | 'done'

/**
 * 建立帳號（訪客訂單綁定會員）。
 *
 * 從購買成功頁／成功信連來時網址帶 ?email=，自動帶入且鎖定。
 * 綁定規則：不可只憑前端輸入的 Email 合併資料——必須以驗證碼
 * 確認 Email 所有權後，後端才把同一 Email 的訪客訂單、課程與
 * 學習進度綁定到新帳號。此頁為前端示範，驗證碼流程為模擬。
 */
export default function RegisterApp() {
  const prefilledEmail = useMemo(
    () => new URLSearchParams(location.search).get('email') ?? '',
    [],
  )
  const emailLocked = prefilledEmail !== '' && isEmail(prefilledEmail)

  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState(emailLocked ? prefilledEmail : '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [code, setCode] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const errors = {
    email: !email.trim() ? '請填寫 Email' : !isEmail(email) ? 'Email 格式不正確' : null,
    password: password.length < 8 ? '密碼至少 8 個字元' : null,
    confirm: confirm !== password ? '兩次輸入的密碼不一致' : null,
  }
  const formValid = !errors.email && !errors.password && !errors.confirm

  const submitForm = () => {
    setAttempted(true)
    if (formValid) setStep('verify')
  }

  const submitCode = () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setCodeError('請輸入 6 位數驗證碼')
      return
    }
    setCodeError(null)
    setVerifying(true)
    // 模擬後端驗證與訂單綁定
    timer.current = window.setTimeout(() => {
      setVerifying(false)
      setStep('done')
    }, 900)
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-md px-4 py-10 sm:px-6 lg:py-16">
        {step === 'form' && (
          <>
            <h1 className="text-2xl sm:text-3xl">建立帳號</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              建立帳號後，這個 Email 的訪客訂單、已購課程、觀看紀錄與學習進度將自動綁定到你的會員帳號。
            </p>

            <div className="mt-8 space-y-5">
              <Field
                label="Email"
                required
                error={attempted ? errors.email : null}
                hint={emailLocked ? '已帶入購買時使用的 Email' : undefined}
              >
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    type="email"
                    autoComplete="email"
                    value={email}
                    readOnly={emailLocked}
                    invalid={invalid}
                    className={emailLocked ? 'bg-ivory-50 text-ink-500' : ''}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}
              </Field>

              <Field label="設定密碼" required error={attempted ? errors.password : null} hint="至少 8 個字元">
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    invalid={invalid}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}
              </Field>

              <Field label="再次輸入密碼" required error={attempted ? errors.confirm : null}>
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    type="password"
                    autoComplete="new-password"
                    value={confirm}
                    invalid={invalid}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                )}
              </Field>

              <Button block size="lg" onClick={submitForm}>
                寄送驗證碼
              </Button>

              <p className="text-xs leading-relaxed text-ink-400">
                為確認 Email 所有權，我們會寄送一次性驗證碼到你的信箱；完成驗證後才會綁定訂單資料。
              </p>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <h1 className="text-2xl sm:text-3xl">輸入驗證碼</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              驗證碼已寄至 <strong className="font-semibold text-ink-900">{email}</strong>
              ，請於 10 分鐘內輸入。
            </p>

            <div className="mt-8 space-y-5">
              <Field label="驗證碼" required error={codeError} hint="示範環境：輸入任意 6 位數字即可通過">
                {(id, invalid) => (
                  <TextInput
                    id={id}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    invalid={invalid}
                    className="text-center text-2xl tracking-[0.5em] tabular-nums"
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, ''))
                      setCodeError(null)
                    }}
                  />
                )}
              </Field>

              <Button block size="lg" onClick={submitCode} disabled={verifying}>
                {verifying ? '驗證中…' : '完成驗證並建立帳號'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="block w-full text-center text-sm text-ink-500 underline underline-offset-4"
              >
                返回修改資料
              </button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-felt-50 ring-1 ring-felt-200">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-felt-600">
                <path d="M9.1 17.2L4 12.1l1.7-1.7 3.4 3.4 9.2-9.2L20 6.3z" />
              </svg>
            </span>
            <h1 className="mt-6 text-2xl sm:text-3xl">帳號建立完成</h1>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              <strong className="font-semibold text-ink-900">{email}</strong>{' '}
              的訪客訂單、已購課程與學習進度已綁定到你的會員帳號。
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="./course.html" size="lg">
                開始學習
              </Button>
              <Button href="./" variant="secondary" size="lg">
                回到首頁
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
