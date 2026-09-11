'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

type TCarouselState = {
  canPrev: boolean
  canNext: boolean
  thumbWidth: number
  thumbOffset: number
}

const NAV_BUTTON =
  'flex size-11 items-center justify-center rounded-full border border-black-300 bg-black-200 text-lg text-white backdrop-blur-lg transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-black-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100'

const ProjectCarousel = ({ children, label }: { children: ReactNode; label: string }) => {
  const trackRef = useRef<HTMLUListElement>(null)
  const trackId = useId()
  const [state, setState] = useState<TCarouselState>({ canPrev: false, canNext: true, thumbWidth: 40, thumbOffset: 0 })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const measure = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const maxScroll = track.scrollWidth - track.clientWidth
        const thumbWidth = track.scrollWidth > 0 ? (track.clientWidth / track.scrollWidth) * 100 : 100
        setState({
          canPrev: track.scrollLeft > 1,
          canNext: track.scrollLeft < maxScroll - 1,
          thumbWidth,
          thumbOffset: maxScroll > 0 ? (track.scrollLeft / maxScroll) * (100 - thumbWidth) : 0,
        })
      })
    }

    measure()
    track.addEventListener('scroll', measure, { passive: true })
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', measure)
      resizeObserver.disconnect()
    }
  }, [])

  const overflowing = state.canPrev || state.canNext

  return (
    <div className="mt-8">
      <ul
        ref={trackRef}
        id={trackId}
        aria-label={label}
        className={cn(
          // px/py-2 chừa chỗ cho focus ring của thẻ — vùng cuộn ngang cắt mọi thứ tràn ra ngoài.
          'scrollbar-hide -mx-2 flex snap-x snap-mandatory scroll-px-2 gap-5 overflow-x-auto px-2 py-2',
          state.canPrev &&
            state.canNext &&
            '[mask-image:linear-gradient(to_right,transparent,#000_40px,#000_calc(100%_-_40px),transparent)]',
          !state.canPrev &&
            state.canNext &&
            '[mask-image:linear-gradient(to_right,#000_calc(100%_-_40px),transparent)]',
          state.canPrev && !state.canNext && '[mask-image:linear-gradient(to_right,transparent,#000_40px)]',
        )}
      >
        {children}
      </ul>

      {overflowing && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <div aria-hidden className="relative h-1 w-24 overflow-hidden rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 rounded-full bg-purple transition-[left] duration-150"
              style={{ width: `${state.thumbWidth}%`, left: `${state.thumbOffset}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCarousel
