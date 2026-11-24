'use client'

import React, { useEffect, useState } from 'react'
import { ArrowUpOutlined } from '@ant-design/icons'

interface ScrollToTopButtonProps {
  /** Số pixel cuộn xuống trước khi nút xuất hiện */
  offset?: number
}

const ScrollToTopButton = ({ offset = 400 }: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setVisible(window.scrollY > offset)
    }

    // Scroll bắn liên tục — gom về mỗi frame một lần để không setState thừa
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    // Chạy ngay một lần: người dùng có thể vào trang ở vị trí đã cuộn sẵn
    // (back/forward restoration hoặc mở link có anchor)
    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [offset])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      // Ẩn bằng opacity + pointer-events thay vì unmount để giữ được transition
      className={`fixed bottom-10 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full
        border border-blue-950 bg-black-100/90 text-white-100 shadow-xl backdrop-blur-md
        transition-all duration-300 hover:border-purple hover:text-purple
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple
        ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
    >
      <ArrowUpOutlined style={{ fontSize: '18px' }} />
    </button>
  )
}

export default ScrollToTopButton
