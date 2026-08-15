import { useSyncExternalStore } from 'react'

/**
 * 登入狀態 store（localStorage + 訂閱通知），寫法與 lib/cart 一致。
 *
 * ⚠️ 後端尚未串接：這裡只保存「已登入的識別資訊」（Email 與顯示名稱），
 * 絕對不存密碼或任何憑證。正式串接後改為讀取後端簽發的 httpOnly cookie／
 * 呼叫 /api/me，本檔的 signIn／signOut 換成 API 呼叫即可，UI 不需更動。
 */

export type Session = {
  email: string
  /** 顯示名稱；未設定時 UI 以 Email 前綴代替 */
  name?: string
  /** 頭像：縮成 160px 的 data URL；未設定時顯示名稱首字 */
  avatar?: string
}

const KEY = 'poolgress.session.v1'

function load(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    return parsed && typeof parsed.email === 'string' ? parsed : null
  } catch {
    return null
  }
}

let cache: Session | null = load()
const listeners = new Set<() => void>()

function commit(next: Session | null) {
  cache = next
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
  } catch {
    /* 隱私模式等寫入失敗時仍維持記憶體內狀態 */
  }
  listeners.forEach((l) => l())
}

export const session = {
  get: (): Session | null => cache,
  /** 建立本機登入狀態（後端串接後改由 API 回應觸發） */
  signIn(s: Session) {
    commit(s)
  },
  signOut() {
    commit(null)
  },
  /** 更新頭像（data URL）；傳 null 清除 */
  setAvatar(avatar: string | null) {
    if (!cache) return
    commit({ ...cache, avatar: avatar ?? undefined })
  },
  /** 更新顯示名稱；空字串視為清除（UI 改用 Email 前綴） */
  setName(name: string) {
    if (!cache) return
    const trimmed = name.trim()
    commit({ ...cache, name: trimmed || undefined })
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

if (typeof window !== 'undefined') {
  // 跨分頁同步：其他分頁登入／登出時本頁一起更新
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = load()
      listeners.forEach((l) => l())
    }
  })
}

export function useSession(): Session | null {
  return useSyncExternalStore(session.subscribe, session.get, () => null)
}

/** 頭像顯示字元：優先取名稱首字，否則取 Email 首字 */
export function initialOf(s: Session): string {
  const source = s.name?.trim() || s.email.trim()
  return source.charAt(0).toUpperCase() || '?'
}

/** 顯示名稱：未設定名稱時用 Email 的 @ 前綴 */
export function displayNameOf(s: Session): string {
  return s.name?.trim() || s.email.split('@')[0]
}

/** 顯示名稱長度上限 */
export const MAX_NAME_LENGTH = 20

/** 頭像上限邊長；縮圖後存 localStorage，避免超過容量 */
const AVATAR_SIZE = 160

/**
 * 讀取使用者選的圖片，置中裁成正方形並縮到 160px 後回傳 data URL。
 * 只在瀏覽器端處理，不上傳（後端串接後改為上傳並存回傳的網址）。
 */
export function readAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('請選擇圖片檔'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = AVATAR_SIZE
      canvas.height = AVATAR_SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('無法處理圖片'))
        return
      }
      // 置中裁切成正方形，避免變形
      const side = Math.min(img.width, img.height)
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        AVATAR_SIZE,
        AVATAR_SIZE,
      )
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('圖片讀取失敗'))
    }
    img.src = url
  })
}
