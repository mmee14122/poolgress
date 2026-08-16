import { useEffect, useState } from 'react'
import {
  mockScenarios,
  currentScenario,
  setScenario,
  subscribeScenario,
  orderLock,
  debugEnabled,
} from '../../lib/payment'

/**
 * 開發用付款情境切換器（結帳頁右下角，預設收合）。
 *
 * 顯示條件：開發模式，或任何環境網址加上 ?debug。
 * 正式 production build 不加參數時完全不會渲染。
 * 也可以直接用網址觸發單一情境，例如 ?pay=pending_confirmation。
 */
export function PaymentDebugPanel() {
  const [open, setOpen] = useState(false)
  const [scenario, setLocal] = useState(currentScenario)
  const [lock, setLock] = useState(orderLock.read)

  useEffect(() => {
    const unsubscribe = subscribeScenario(() => setLocal(currentScenario()))
    return () => {
      unsubscribe()
    }
  }, [])

  if (!debugEnabled()) return null

  const forcedByUrl = new URLSearchParams(location.search).has('pay')

  return (
    <div className="fixed right-3 bottom-24 z-[60] w-[min(20rem,calc(100vw-1.5rem))] text-left lg:bottom-3">
      {open ? (
        <div className="rounded-card border border-line bg-white p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">付款情境模擬（開發用）</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="收合付款情境模擬"
              className="rounded-full px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ivory-100"
            >
              收合
            </button>
          </div>

          {forcedByUrl && (
            <p className="mt-2 rounded-lg bg-brass-400/15 px-2.5 py-1.5 text-xs text-ink-700">
              目前由網址 <code>?pay=</code> 指定，面板選擇會被忽略。
            </p>
          )}

          <label className="mt-3 block text-xs font-semibold text-ink-700" htmlFor="pay-scenario">
            送出付款後要模擬的結果
          </label>
          <select
            id="pay-scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-900"
          >
            {mockScenarios.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-ink-500">
            {mockScenarios.find((s) => s.value === scenario)?.note}
          </p>

          <div className="mt-4 border-t border-line pt-3">
            <p className="text-xs font-semibold text-ink-700">目前訂單鎖</p>
            <p className="mt-1 text-xs break-all text-ink-500">
              {lock ? `${lock.orderId}｜${lock.status}` : '（無）'}
            </p>
            <button
              type="button"
              onClick={() => {
                orderLock.clear()
                setLock(null)
              }}
              className="mt-2 rounded-full bg-ivory-100 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ivory-200"
            >
              清除訂單鎖
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setLock(orderLock.read())
            setOpen(true)
          }}
          className="ml-auto flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          付款情境模擬
        </button>
      )}
    </div>
  )
}
