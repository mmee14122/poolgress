import { useEffect, useState } from 'react'

/**
 * 回傳目前捲動位置所在的區段 id。
 *
 * 判定線＝各區段自己的 scroll-margin-top（就是錨點捲動後它會停的位置），
 * 不使用寫死的數值——寫死時只要與 scroll-mt 不一致（例如手機 160px
 * 對上判定線 140px），點擊索引跳轉後目標區段會落在判定線下方而選不到，
 * 造成「畫面跳對了、索引卻高亮前一項」。
 *
 * 另外在點擊錨點後短暫鎖定高亮：平滑捲動過程會經過中間區段，
 * 不鎖的話索引會一路閃動再回到目標。
 *
 * @param ids 區段 id，需與 DOM 順序一致
 */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let ticking = false
    /* 鎖定到期時間：點擊錨點後在這之前不接受捲動判定 */
    let lockUntil = 0

    /** 各區段的判定線（＝scroll-margin-top），resize 時重算 */
    let offsets = new Map<string, number>()
    const measure = () => {
      offsets = new Map(
        ids.map((id) => {
          const el = document.getElementById(id)
          const mt = el ? parseFloat(getComputedStyle(el).scrollMarginTop) : 0
          return [id, Number.isFinite(mt) ? mt : 0]
        }),
      )
    }

    const update = () => {
      ticking = false
      if (Date.now() < lockUntil) return

      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        // +2px 容差：瀏覽器捲動落點可能有次像素誤差
        if (el.getBoundingClientRect().top - (offsets.get(id) ?? 0) <= 2) current = id
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

    const onResize = () => {
      measure()
      onScroll()
    }

    /* 點擊頁內錨點：立刻高亮目標並鎖住，等平滑捲動結束再恢復判定 */
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!.slice(1)
      if (!ids.includes(id)) return
      setActive(id)
      lockUntil = Date.now() + 900
    }

    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('click', onClick)
    /* 支援 scrollend 的瀏覽器可提早解鎖，手感更即時 */
    const onScrollEnd = () => {
      lockUntil = 0
      onScroll()
    }
    window.addEventListener('scrollend', onScrollEnd)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('click', onClick)
      window.removeEventListener('scrollend', onScrollEnd)
    }
  }, [ids])

  return active
}
