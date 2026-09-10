'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { FaLocationArrow } from 'react-icons/fa6'
import { LuArrowUpRight } from 'react-icons/lu'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/src/lib/utils'
import ComingSoonBadge from './ComingSoonBadge'

type TSubProjectStripItem = {
  name: string
  tagline: string
  description: string
  href?: string
  cta?: string
  icon: ReactNode
  preview: ReactNode
}

// Trễ một nhịp trước khi mở: lướt chuột ngang qua dải thì popover không nháy liên tục.
const OPEN_DELAY_MS = 120

// Chiều cao ước lượng của popover, đủ để quyết định mở xuống dưới hay lật lên trên.
const POPOVER_SPACE = 420

const SubProjectStripItem = ({ name, tagline, description, href, cta, icon, preview }: TSubProjectStripItem) => {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  const itemRef = useRef<HTMLLIElement>(null)
  const openTimer = useRef<number | undefined>(undefined)
  const descriptionId = useId()

  const show = () => {
    window.clearTimeout(openTimer.current)
    const rect = itemRef.current?.getBoundingClientRect()
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom
      setPlacement(spaceBelow >= POPOVER_SPACE || spaceBelow >= rect.top ? 'bottom' : 'top')
    }
    setOpen(true)
  }

  const hide = () => {
    window.clearTimeout(openTimer.current)
    setOpen(false)
  }

  useEffect(() => {
    const timer = openTimer
    return () => window.clearTimeout(timer.current)
  }, [])

  // Nội dung hiện ra khi hover phải tắt được mà không cần dời chuột/focus (WCAG 1.4.13).
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const content = (
    <>
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#10132E] text-xl xl:size-12 xl:text-2xl',
          href ? 'text-purple' : 'text-purple/60',
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span
          className={cn(
            'text-base font-semibold leading-6 xl:text-lg xl:leading-7',
            href ? 'text-white' : 'text-white/75',
          )}
        >
          {name}
        </span>
        {href ? (
          <span className="text-[13px] leading-[18px] text-white-100 xl:text-sm xl:leading-5">{tagline}</span>
        ) : (
          <ComingSoonBadge className="px-2 py-px text-[11px]" />
        )}
      </span>
      {href && <LuArrowUpRight aria-hidden className="shrink-0 text-lg text-purple xl:text-xl" />}
    </>
  )

  const itemClassName = cn(
    // Từ xl mỗi mục rộng ~400px: nới padding, icon và chữ để dải cân với các section khác.
    // Ở lg mỗi mục chỉ ~320px nên giữ cỡ nhỏ, tránh dòng mô tả bị xuống dòng.
    'flex h-full items-center gap-3.5 px-4 py-6 transition-colors duration-200 xl:gap-4 xl:px-6 xl:py-8',
    'group-first/item:rounded-l-2xl group-last/item:rounded-r-2xl',
    open && 'bg-white/[0.04]',
  )

  const card = (
    <motion.div
      initial={{ opacity: 0, y: placement === 'bottom' ? -6 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: placement === 'bottom' ? -6 : 6 }}
      transition={{ duration: 0.18 }}
      className="relative rounded-2xl border border-white/[0.1] bg-[linear-gradient(90deg,rgb(4,7,29)_0%,rgb(12,14,35)_100%)] p-4 shadow-2xl shadow-black/60"
    >
      <span
        className={cn(
          'absolute left-1/2 size-3 -translate-x-1/2 rotate-45 border-white/[0.1] bg-[rgb(8,10,32)]',
          placement === 'bottom' ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-b border-r',
        )}
      />
      <div className="relative h-[220px] overflow-hidden rounded-lg border border-white/[0.06] bg-[rgb(4,7,29)]">
        {preview}
      </div>
      <p className="mt-4 text-base leading-relaxed text-white-100">{description}</p>
      <div className="mt-4 flex items-center justify-end">
        {href ? (
          <span className="flex items-center gap-2.5 text-sm text-purple">
            {cta}
            <FaLocationArrow />
          </span>
        ) : (
          <ComingSoonBadge />
        )}
      </div>
    </motion.div>
  )

  return (
    <li
      ref={itemRef}
      className="group/item relative"
      // Chỉ chuột mới mở bằng hover. Chạm trên màn cảm ứng đi thẳng vào link — nếu để
      // chạm cũng bật popover thì iOS bắt chạm hai lần mới điều hướng được.
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        window.clearTimeout(openTimer.current)
        openTimer.current = window.setTimeout(show, OPEN_DELAY_MS)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') hide()
      }}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide()
      }}
    >
      {href ? (
        <Link
          href={href}
          aria-describedby={descriptionId}
          className={cn(
            itemClassName,
            'hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple',
          )}
        >
          {content}
        </Link>
      ) : (
        <div className={itemClassName}>{content}</div>
      )}

      {/* Popover chỉ tồn tại khi mở, nên mô tả cho screen reader nằm sẵn ở đây. */}
      <span id={descriptionId} className="sr-only">
        {description}
      </span>

      <AnimatePresence>
        {open && (
          // aria-hidden: nội dung đã có qua aria-describedby; bấm vào preview vẫn điều
          // hướng cho người dùng chuột, nhưng không thêm tab stop trùng lặp.
          <div
            key="preview"
            aria-hidden
            className={cn(
              'absolute left-1/2 z-20 w-[380px] -translate-x-1/2',
              placement === 'bottom' ? 'top-full pt-3' : 'bottom-full pb-3',
            )}
          >
            {href ? (
              <Link href={href} tabIndex={-1} className="block">
                {card}
              </Link>
            ) : (
              card
            )}
          </div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default SubProjectStripItem
