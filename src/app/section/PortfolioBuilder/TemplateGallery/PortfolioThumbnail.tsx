/**
 * PortfolioThumbnail — Ảnh thu nhỏ "sống" của 1 trang portfolio.
 * Nhúng chính trang thật vào iframe ở kích thước desktop (FRAME_WIDTH × FRAME_HEIGHT)
 * rồi scale xuống vừa khung → hiển thị đúng như trang thật, CSS tách biệt hoàn toàn.
 * Chỉ để xem: không click / focus được vào bên trong iframe.
 */
'use client'

import { useEffect, useRef, useState } from 'react'

const FRAME_WIDTH = 1280
const FRAME_HEIGHT = 800 // khớp tỉ lệ khung aspect-[16/10]

interface PortfolioThumbnailProps {
  src: string
  title: string
}

export const PortfolioThumbnail = ({ src, title }: PortfolioThumbnailProps) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)
  const [loaded, setLoaded] = useState(false)

  /**
   * Trang trong iframe được render ở khổ desktop rồi thu nhỏ → scrollbar của nó
   * (và dev indicator của Next) cũng bị thu nhỏ theo, trông như lỗi. Cùng origin
   * nên chèn CSS ẩn chúng đi được.
   */
  const handleLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const doc = e.currentTarget.contentDocument
      if (doc) {
        const style = doc.createElement('style')
        style.textContent = `
          html, body { overflow: hidden !important; scrollbar-width: none !important; }
          html::-webkit-scrollbar, body::-webkit-scrollbar { display: none !important; }
          nextjs-portal { display: none !important; }
        `
        doc.head.appendChild(style)
      }
    } catch {
      // Khác origin → bỏ qua, scrolling="no" vẫn ẩn được scrollbar
    }
    setLoaded(true)
  }

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / FRAME_WIDTH)
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={boxRef} className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-800/60" />}
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden
          onLoad={handleLoad}
          className="absolute top-0 left-0 origin-top-left pointer-events-none border-0 transition-opacity duration-300"
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: `scale(${scale})`,
            opacity: loaded ? 1 : 0,
          }}
        />
      )}
    </div>
  )
}
