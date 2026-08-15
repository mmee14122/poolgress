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
  /** 信箱已被註冊 */
  | 'email_taken'
  /** 服務尚未接上後端 */
  | 'not_configured'
  /** 其他（網路錯誤、5xx…） */
  | 'unknown'

export type AuthResult = { ok: true } | { ok: false; code: AuthErrorCode }

const NOT_CONFIGURED: AuthResult = { ok: false, code: 'not_configured' }

/** 登入成功後的導向位置。會員中心建置後改這裡即可（相對路徑，子資料夾部署適用） */
export const AFTER_LOGIN_URL = './index.html'

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
