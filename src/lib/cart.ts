import { useSyncExternalStore } from 'react'
import type { Product } from '../data/catalog'

/**
 * 購物車 store：localStorage 持久化 + 訂閱通知。
 * 同分頁內任何元件（導覽列徽章、mini cart、購物車頁）即時同步；
 * 跨分頁靠 storage 事件同步。接後端時把這層換成 API + 快取即可。
 */

export type CartItem = Product

const KEY = 'poolgress.cart.v1'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let cache: CartItem[] = load()
const listeners = new Set<() => void>()

function commit(next: CartItem[]) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* 隱私模式等寫入失敗時仍維持記憶體內狀態 */
  }
  listeners.forEach((l) => l())
}

export const cart = {
  items: (): CartItem[] => cache,
  count: (): number => cache.length,
  subtotal: (): number => cache.reduce((sum, i) => sum + i.price, 0),
  has: (id: string): boolean => cache.some((i) => i.id === id),
  add(item: CartItem) {
    if (!cart.has(item.id)) commit([...cache, item])
  },
  remove(id: string) {
    commit(cache.filter((i) => i.id !== id))
  },
  clear() {
    commit([])
  },
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

// 其他分頁改動購物車時同步
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    cache = load()
    listeners.forEach((l) => l())
  }
})

/** React hook：訂閱購物車內容 */
export function useCart(): CartItem[] {
  return useSyncExternalStore(cart.subscribe, cart.items)
}

export const formatNT = (n: number) => `NT$${n.toLocaleString('zh-TW')}`
