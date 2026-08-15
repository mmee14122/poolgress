/** 結帳表單即時驗證規則 */

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** 密碼長度下限（登入／註冊共用） */
export const MIN_PASSWORD_LENGTH = 8

/** 台灣手機號碼 */
export const isPhoneTW = (v: string) => /^09\d{8}$/.test(v.trim())

/** 手機條碼載具：/ 開頭 + 7 碼（數字、大寫英文、+ - .） */
export const isMobileBarcode = (v: string) => /^\/[0-9A-Z.+-]{7}$/.test(v.trim())

/** 自然人憑證條碼：2 碼大寫英文 + 14 碼數字 */
export const isCitizenCert = (v: string) => /^[A-Z]{2}\d{14}$/.test(v.trim())

/**
 * 統一編號：8 碼 + 官方檢核（112 年新制，加權和可被 5 整除；
 * 第 7 碼為 7 時，加權和 +1 亦可）。
 */
export function isTaxId(v: string): boolean {
  const s = v.trim()
  if (!/^\d{8}$/.test(s)) return false
  const weights = [1, 2, 1, 2, 1, 2, 4, 1]
  let sum = 0
  for (let i = 0; i < 8; i++) {
    const product = Number(s[i]) * weights[i]
    sum += Math.floor(product / 10) + (product % 10)
  }
  return sum % 5 === 0 || (s[6] === '7' && (sum + 1) % 5 === 0)
}
