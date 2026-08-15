import { useEffect, useState } from 'react'

export type Remaining = { days: number; hours: number; minutes: number; seconds: number }

function remainingUntil(target: string): Remaining | null {
  const diff = new Date(target).getTime() - Date.now()
  if (Number.isNaN(diff) || diff <= 0) return null

  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

/**
 * 倒數計時。
 * target 為 null 代表尚未設定檔期，呼叫端應顯示「＿＿」佔位符；
 * 回傳 null 且 target 有值代表已過期，呼叫端應隱藏促銷區。
 */
export function useCountdown(target: string | null) {
  const [remaining, setRemaining] = useState(() => (target ? remainingUntil(target) : null))

  useEffect(() => {
    if (!target) return
    setRemaining(remainingUntil(target))

    const timer = setInterval(() => setRemaining(remainingUntil(target)), 1000)
    return () => clearInterval(timer)
  }, [target])

  return remaining
}
