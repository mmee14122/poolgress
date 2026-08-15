import { useEffect, useState } from 'react'

/**
 * 回傳目前捲動位置所在的區段 id。
 *
 * 用捲動位置 + getBoundingClientRect 而非 IntersectionObserver：
 * scroll spy 要的是「哪一段在頂端」，IO 給的是「哪些段有交集」，
 * 長短不一的區段用 IO 的 threshold 很難調準。
 *
 * @param ids     區段 id，需與 DOM 順序一致
 * @param offset  判定線距離視窗頂端的距離，應等於 sticky 導覽列高度
 */
export function useScrollSpy(ids: readonly string[], offset = 140) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const update = () => {
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
      }

      // 捲到底部時強制高亮最後一段，否則過短的結尾區段永遠選不到
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) current = ids[ids.length - 1]

      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids, offset])

  return active
}
