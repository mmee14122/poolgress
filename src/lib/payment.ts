/**
 * 交易狀態模型（前端 mock，後端與金流串接時整支對應替換）。
 *
 * 設計原則：使用者永遠知道四件事——
 *   1. 現在發生什麼事  2. 是否已扣款  3. 下一步做什麼  4. 要重付、等待、還是找客服
 * 因此「失敗」與「結果未確認」是兩種不同狀態，絕不可混為一談。
 *
 * 後端串接對照（見 HANDOVER.md 第 10 節）：
 *   validating          → 前端驗證，不需 API
 *   processing          → POST /orders 建立訂單並送出付款（需回 orderId）
 *   requires_action     → 金流回 3DS／外部付款頁 redirectUrl
 *   succeeded           → 付款回呼 status=paid 且權限已開通
 *   succeeded_provisioning → status=paid 但 entitlement 尚未寫入
 *   pending_confirmation→ 未收到回呼／逾時，需輪詢 GET /orders/:id
 *   failed              → 回呼 status=failed，附 failureReason
 *   cancelled           → 使用者取消外部付款
 *   already_paid        → 同一 orderId 已付款（idempotency）
 *   already_owned       → 帳號已擁有該課程 entitlement
 *   network_error       → 請求本身失敗（fetch reject / 5xx）
 *   session_expired     → API 回 401
 */

export type TxStatus =
  | 'idle'
  | 'validating'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'succeeded_provisioning'
  | 'failed'
  | 'cancelled'
  | 'pending_confirmation'
  | 'already_paid'
  | 'already_owned'
  | 'network_error'
  | 'session_expired'

/** 失敗原因：每一種都對應一句人類看得懂的說明，不顯示錯誤碼 */
export type FailureReason =
  | 'card_declined'
  | 'card_invalid'
  | 'three_ds_failed'
  | 'gateway_unavailable'
  | 'network_timeout'
  | 'method_unavailable'

export const failureCopy: Record<FailureReason, { title: string; body: string }> = {
  card_declined: {
    title: '銀行未核准這筆付款',
    body: '銀行未能核准這筆付款。請確認卡片額度，或改用其他付款方式。',
  },
  card_invalid: {
    title: '付款資訊似乎有誤',
    body: '付款資訊似乎有誤，請確認卡號、有效期限與安全碼後再試一次。',
  },
  three_ds_failed: {
    title: '銀行驗證未完成',
    body: '銀行驗證未完成，因此尚未付款成功。你可以再次嘗試付款。',
  },
  gateway_unavailable: {
    title: '付款服務暫時忙碌',
    body: '目前付款服務暫時忙碌，請稍後再試。你的款項尚未被確認。',
  },
  network_timeout: {
    title: '連線中斷，尚未能確認結果',
    body: '連線中斷，我們尚未能確認付款結果。請先不要重複付款，請查看訂單狀態。',
  },
  method_unavailable: {
    title: '此付款方式目前無法使用',
    body: '此付款方式目前無法使用，請改用其他付款方式。',
  },
}

/* ------------------------------------------------------------------ */
/* 訂單鎖（mock idempotency）                                          */
/* ------------------------------------------------------------------ */

export type OrderLock = {
  orderId: string
  /** 這一筆訂單目前的處理狀態 */
  status: 'processing' | 'pending_confirmation' | 'paid'
  total: number
  method: string
  email: string
  createdAt: string
}

const LOCK_KEY = 'poolgress.orderLock.v1'

/**
 * 訂單鎖存在 localStorage：使用者重新整理、按上一頁再回來、或另開分頁，
 * 都會讀到同一筆處理中／已付款的訂單，因此不會出現「可以再刷一次」的畫面。
 * 後端接上後改為以 orderId 查 GET /orders/:id，這裡只是它的替身。
 */
export const orderLock = {
  read(): OrderLock | null {
    try {
      const raw = localStorage.getItem(LOCK_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as OrderLock
      return parsed && typeof parsed.orderId === 'string' ? parsed : null
    } catch {
      return null
    }
  },
  write(lock: OrderLock) {
    try {
      localStorage.setItem(LOCK_KEY, JSON.stringify(lock))
    } catch {
      /* 隱私模式或容量已滿：鎖失效不影響付款流程本身 */
    }
  },
  update(patch: Partial<OrderLock>) {
    const current = orderLock.read()
    if (!current) return
    orderLock.write({ ...current, ...patch })
  },
  clear() {
    try {
      localStorage.removeItem(LOCK_KEY)
    } catch {
      /* 同上 */
    }
  },
}

/* ------------------------------------------------------------------ */
/* 開發用情境模擬                                                       */
/* ------------------------------------------------------------------ */

/** 可模擬的付款結果（debug 面板與 ?pay= 參數共用同一份清單） */
export const mockScenarios: { value: string; label: string; note: string }[] = [
  { value: 'auto', label: '正常成功', note: '預設：付款成功並開通課程' },
  { value: 'succeeded_provisioning', label: '成功但開通中', note: '已扣款，權限尚未寫入' },
  { value: 'card_declined', label: '失敗：銀行拒絕', note: '額度不足或風控' },
  { value: 'card_invalid', label: '失敗：卡片資訊有誤', note: '卡號／效期／安全碼' },
  { value: 'three_ds_failed', label: '失敗：3D 驗證未完成', note: '取消或逾時' },
  { value: 'gateway_unavailable', label: '失敗：金流忙碌', note: '服務暫時不可用' },
  { value: 'method_unavailable', label: '失敗：付款方式不可用', note: '改用其他方式' },
  { value: 'network_error', label: '網路中斷', note: '請求送不出去' },
  { value: 'pending_confirmation', label: '結果待確認', note: '最重要：不可說失敗' },
  { value: 'requires_action', label: '需要銀行驗證', note: '3DS／外部付款頁' },
  { value: 'cancelled', label: '使用者取消付款', note: '從外部付款頁返回' },
  { value: 'session_expired', label: '登入逾時', note: '結帳中 session 過期' },
  { value: 'already_owned', label: '已擁有此課程', note: '重複購買保護' },
]

const MOCK_KEY = 'poolgress.paymentMock.v1'

/** debug 面板是否顯示：開發模式，或任何環境加上 ?debug 參數 */
export function debugEnabled(): boolean {
  if (import.meta.env.DEV) return true
  try {
    return new URLSearchParams(location.search).has('debug')
  } catch {
    return false
  }
}

/**
 * 目前要模擬的情境。優先序：網址 ?pay=xxx ＞ debug 面板選擇 ＞ auto。
 * production build 沒開 ?debug 時面板不顯示，但 ?pay= 仍可用於內部驗收。
 */
export function currentScenario(): string {
  try {
    const fromUrl = new URLSearchParams(location.search).get('pay')
    if (fromUrl) return fromUrl
    return localStorage.getItem(MOCK_KEY) || 'auto'
  } catch {
    return 'auto'
  }
}

export function setScenario(value: string) {
  try {
    if (value === 'auto') localStorage.removeItem(MOCK_KEY)
    else localStorage.setItem(MOCK_KEY, value)
  } catch {
    /* 忽略 */
  }
  scenarioListeners.forEach((l) => l())
}

const scenarioListeners = new Set<() => void>()
export function subscribeScenario(listener: () => void) {
  scenarioListeners.add(listener)
  return () => scenarioListeners.delete(listener)
}

/** 把模擬情境轉成「這次付款的結果」 */
export function resolveScenario(scenario: string): {
  status: TxStatus
  reason?: FailureReason
} {
  switch (scenario) {
    case 'card_declined':
    case 'card_invalid':
    case 'three_ds_failed':
    case 'gateway_unavailable':
    case 'method_unavailable':
      return { status: 'failed', reason: scenario }
    case 'network_error':
      return { status: 'network_error', reason: 'network_timeout' }
    case 'pending_confirmation':
      return { status: 'pending_confirmation' }
    case 'requires_action':
      return { status: 'requires_action' }
    case 'cancelled':
      return { status: 'cancelled' }
    case 'session_expired':
      return { status: 'session_expired' }
    case 'already_owned':
      return { status: 'already_owned' }
    case 'succeeded_provisioning':
      return { status: 'succeeded_provisioning' }
    default:
      return { status: 'succeeded' }
  }
}

/** 結帳中登入逾時：登入後回到結帳頁繼續（購物車與表單資料都保留） */
export function loginUrlForCheckout(): string {
  return `./login.html?redirect=${encodeURIComponent('./checkout.html')}`
}
