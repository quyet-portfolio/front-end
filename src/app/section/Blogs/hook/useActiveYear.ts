'use client'

import { useEffect, useState } from 'react'

/**
 * Theo dõi năm của group đang nằm giữa viewport để highlight trên rail.
 * Dùng MỘT observer với nhiều target thay vì một observer cho mỗi group.
 */
export const useActiveYear = (itemCount: number): number | null => {
  const [activeYear, setActiveYear] = useState<number | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-year]'))
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (!visible) return
        const year = Number(visible.target.getAttribute('data-year'))
        if (!Number.isNaN(year)) setActiveYear(year)
      },
      // Dải mỏng ngang giữa viewport — group nào cắt qua dải này là group đang xem
      { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
    // Chạy lại khi có batch mới để observe các group vừa append
  }, [itemCount])

  return activeYear
}
