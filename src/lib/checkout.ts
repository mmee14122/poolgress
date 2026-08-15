import { isEmail, isPhoneTW, isMobileBarcode, isCitizenCert, isTaxId } from './validate'

/** 結帳流程的型別與純函式。UI 元件只負責呈現，規則集中在這裡。 */

export type BuyerMode = 'member' | 'guest'
export type PaymentMethod = 'card' | 'installment' | 'atm' | 'cvs'
export type InvoiceType = 'personal' | 'donate' | 'company'
export type Carrier = 'member' | 'mobile' | 'cert'

export const paymentOptions: { value: PaymentMethod; title: string; description: string }[] = [
  { value: 'card', title: '信用卡一次付清', description: '付款完成後立即開通課程。' },
  { value: 'installment', title: '信用卡分期付款', description: '可選擇銀行與分期期數。' },
  { value: 'atm', title: 'ATM 轉帳', description: '取得虛擬帳號後於期限內轉帳。' },
  { value: 'cvs', title: '超商代碼繳費', description: '取得繳費代碼後至超商繳費。' },
]

/** ⚠️ 示範銀行清單，正式合作銀行由金流商提供 */
export const installmentBanks = ['示範銀行 A', '示範銀行 B', '示範銀行 C']
export const installmentTerms = [3, 6, 12]

/** ⚠️ 示範捐贈單位，正式名單待補 */
export const donationTargets = [
  { value: 'unit-a', label: '捐贈單位待補 A（示範）' },
  { value: 'unit-b', label: '捐贈單位待補 B（示範）' },
  { value: 'custom', label: '自行輸入捐贈碼' },
]

export type CheckoutForm = {
  mode: BuyerMode
  memberLoggedIn: boolean
  memberEmail: string
  guest: { email: string; name: string; phone: string }
  method: PaymentMethod | ''
  bank: string
  terms: number
  invoiceType: InvoiceType
  carrier: Carrier
  mobileCode: string
  certCode: string
  donateTarget: string
  donateCode: string
  company: { name: string; taxId: string; address: string }
}

export type FieldErrors = Partial<Record<string, string>>

/** 逐欄驗證。回傳 {} 代表可送出 */
export function validateCheckout(f: CheckoutForm): FieldErrors {
  const e: FieldErrors = {}

  if (f.mode === 'member') {
    if (!f.memberLoggedIn) e.member = '請先登入會員，或改用非會員購買'
  } else {
    if (!f.guest.email.trim()) e.guestEmail = '請填寫 Email'
    else if (!isEmail(f.guest.email)) e.guestEmail = 'Email 格式不正確'
    if (!f.guest.name.trim()) e.guestName = '請填寫姓名'
    // 聯絡電話依金流需求可改為必填；目前選填、填了就檢查格式
    if (f.guest.phone.trim() && !isPhoneTW(f.guest.phone)) e.guestPhone = '手機格式不正確（例：0912345678）'
  }

  if (!f.method) e.method = '請選擇付款方式'
  if (f.method === 'installment') {
    if (!f.bank) e.bank = '請選擇分期銀行'
    if (!f.terms) e.terms = '請選擇分期期數'
  }

  if (f.invoiceType === 'personal') {
    if (f.carrier === 'mobile' && !isMobileBarcode(f.mobileCode))
      e.mobileCode = '手機條碼格式不正確（例：/ABC+123）'
    if (f.carrier === 'cert' && !isCitizenCert(f.certCode))
      e.certCode = '自然人憑證條碼格式不正確（2 碼大寫英文 + 14 碼數字）'
  }
  if (f.invoiceType === 'donate' && f.donateTarget === 'custom' && !/^\d{3,7}$/.test(f.donateCode.trim()))
    e.donateCode = '捐贈碼為 3 至 7 碼數字'
  if (f.invoiceType === 'company') {
    if (!f.company.name.trim()) e.companyName = '請填寫公司名稱'
    if (!isTaxId(f.company.taxId)) e.companyTaxId = '統一編號格式不正確（8 碼數字）'
  }

  return e
}

/** 給「確認購買」按鈕下方的缺漏摘要 */
export function missingSummary(e: FieldErrors): string[] {
  const labels: Record<string, string> = {
    member: '會員登入',
    guestEmail: 'Email',
    guestName: '姓名',
    guestPhone: '聯絡電話',
    method: '付款方式',
    bank: '分期銀行',
    terms: '分期期數',
    mobileCode: '手機條碼',
    certCode: '自然人憑證條碼',
    donateCode: '捐贈碼',
    companyName: '公司名稱',
    companyTaxId: '統一編號',
  }
  return [...new Set(Object.keys(e).map((k) => labels[k] ?? k))]
}

/* ------------------------------------------------------------------ */

export type OrderInfo = {
  id: string
  method: PaymentMethod
  email: string
  total: number
  /** ATM 虛擬帳號或超商繳費代碼 */
  payCode?: string
  bankCode?: string
  deadline?: string
}

/** 建立示範訂單（正式流程由後端與金流商產生） */
export function createDemoOrder(method: PaymentMethod, email: string, total: number): OrderInfo {
  const now = Date.now()
  const id = `PG${String(now).slice(-10)}`
  const base: OrderInfo = { id, method, email, total }

  if (method === 'atm' || method === 'cvs') {
    const deadline = new Date(now + 3 * 86400000)
    base.deadline = deadline.toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })
    if (method === 'atm') {
      base.bankCode = '808（示範）'
      base.payCode = `2026${String(now).slice(-10)}`
    } else {
      base.payCode = `GW${String(now).slice(-10)}`
    }
  }
  return base
}
