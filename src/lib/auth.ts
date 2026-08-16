/**
 * 帳號驗證 API 串接位置。
 *
 * ⚠️ 目前後端與 OAuth 尚未建置：以下函式一律回傳
 * { ok: false, code: 'not_configured' }，不做任何假的登入成功流程，
 * 也不在瀏覽器儲存密碼（密碼只存在於 React state，送出後即丟棄）。
 *
 * 後端完成後，只需替換各函式內以「TODO」標示的區塊，
 * UI 與錯誤處理不需要更動。
 */

export type AuthErrorCode =
  /** 帳密不符（後端回 401 時使用） */
  | 'invalid_credentials'
  /** 此信箱尚未註冊 */
  | 'email_not_found'
  /** 信箱已被註冊 */
  | 'email_taken'
  /** 第三方登入被使用者取消（關閉授權視窗） */
  | 'provider_cancelled'
  /** 第三方登入失敗（授權被拒、憑證交換失敗…） */
  | 'provider_failed'
  /** 重設密碼連結失效或已過期 */
  | 'reset_link_invalid'
  /** 登入 session 已過期 */
  | 'session_expired'
  /** 網路中斷或請求逾時 */
  | 'network_error'
  /** 服務尚未接上後端 */
  | 'not_configured'
  /** 其他（5xx…） */
  | 'unknown'

/**
 * 開發用：以 ?auth=<code> 模擬各種登入失敗，方便驗收畫面。
 * 例：./login.html?auth=invalid_credentials
 * 後端接上後這個函式回傳 null，一切以 API 回應為準。
 */
export function mockAuthError(): AuthErrorCode | null {
  try {
    const code = new URLSearchParams(location.search).get('auth')
    return (code as AuthErrorCode) || null
  } catch {
    return null
  }
}

export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode }

const NOT_CONFIGURED: AuthResult = { ok: false, code: 'not_configured' }

/** 登入成功後的預設導向位置（相對路徑，子資料夾部署適用） */
export const AFTER_LOGIN_URL = './account.html'

/** 帶回原頁面用的網址參數名稱 */
export const REDIRECT_PARAM = 'redirect'

/**
 * 只允許站內的相對頁面，例如 `./my-courses.html` 或 `./coach.html?id=coach-1`。
 * 擋掉絕對網址、協定與 `//`，避免被拿來做開放轉址（open redirect）。
 */
function isSafeRedirect(value: string) {
  if (!value.startsWith('./')) return false
  if (value.includes('//') || value.includes(':') || value.includes('\\')) return false
  return /^\.\/[A-Za-z0-9_-]+\.html(\?[A-Za-z0-9_\-=&%.]*)?(#[A-Za-z0-9_-]*)?$/.test(value)
}

/**
 * 產生「登入後回到原頁面」的登入頁網址。
 * 例：在我的教練課被擋下時 → ./login.html?redirect=.%2Fmy-courses.html
 */
export function loginUrlWithRedirect(target: string, mode?: 'register' | 'forgot') {
  const params = new URLSearchParams()
  if (mode) params.set('mode', mode)
  if (isSafeRedirect(target)) params.set(REDIRECT_PARAM, target)
  const query = params.toString()
  return query ? `./login.html?${query}` : './login.html'
}

/** 目前頁面的相對網址（含 query），供 loginUrlWithRedirect 使用 */
export function currentPageTarget() {
  const file = location.pathname.split('/').pop() || 'index.html'
  return `./${file}${location.search}`
}

/**
 * 登入成功後要去哪裡：有安全的 redirect 參數就回原頁，否則用預設。
 */
export function afterLoginUrl() {
  const raw = new URLSearchParams(location.search).get(REDIRECT_PARAM)
  return raw && isSafeRedirect(raw) ? raw : AFTER_LOGIN_URL
}

/** Email + 密碼登入 */
export async function signInWithPassword(_email: string, _password: string): Promise<AuthResult> {
  // TODO(後端)：POST /api/auth/login，成功時由後端設定 httpOnly cookie；
  // 密碼僅走 HTTPS 傳輸，前端不留存。
  return NOT_CONFIGURED
}

/** 建立帳號 */
export async function signUpWithPassword(_email: string, _password: string): Promise<AuthResult> {
  // TODO(後端)：POST /api/auth/register，回傳後導向驗證信流程
  return NOT_CONFIGURED
}

/**
 * 寄送密碼重設連結。
 * 不論信箱是否存在，都回傳相同結果，避免洩漏帳號註冊狀態。
 */
export async function requestPasswordReset(_email: string): Promise<AuthResult> {
  // TODO(後端)：POST /api/auth/forgot-password
  return NOT_CONFIGURED
}

export type OAuthProvider = 'apple' | 'google'

/** 第三方登入：導向 OAuth 授權頁 */
export async function signInWithProvider(_provider: OAuthProvider): Promise<AuthResult> {
  // TODO(OAuth)：取得授權 URL 後 location.assign(url)。
  // Apple 需 Services ID／Return URL，Google 需 OAuth Client ID／Redirect URI。
  return NOT_CONFIGURED
}
