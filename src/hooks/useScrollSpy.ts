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
    /* rAF 節流：多次 scroll 事件同幀只算一次；量測（getBoundingClientRect）
       集中在同一幀內完成後才 setState，且值相同時 React 會自動略過重渲染 */
    let ticking = false

    const update = () => {
      ticking = false
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

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids, offset])

  return active
}
