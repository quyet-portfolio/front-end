'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { FaLocationArrow } from 'react-icons/fa6'
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/src/lib/utils'
import ComingSoonBadge from './ComingSoonBadge'
import ProjectLink from './ProjectLink'

type TProjectStripItem = {
  name: string
  tagline: string
  description: string
  href?: string
  external: boolean
  location?: string
  cta?: string
  icon: ReactNode
  preview: ReactNode
  /** Mục đầu/cuối neo popover theo mép dải: căn giữa thì popover tràn khỏi viewport ở màn hẹp. */
  align: 'start' | 'center' | 'end'
}

// Trễ một nhịp trước khi mở: lướt chuột ngang qua dải thì popover không nháy liên tục.
const OPEN_DELAY_MS = 120

// Chiều cao ước lượng của popover, đủ để quyết định mở xuống dưới hay lật lên trên.
const POPOVER_SPACE = 420

// Navbar cố định chiếm phần đầu viewport (cùng khoảng scroll-mt-24 của các section):
// lật lên mà không trừ phần này thì popover chui xuống dưới navbar và bị cắt.
const NAVBAR_CLEARANCE = 96

const ProjectStripItem = ({
  name,
  tagline,
  description,
  href,
  external,
  location,
  cta,
  icon,
  preview,
  align,
}: TProjectStripItem) => {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom')
  // Khoảng cách từ mép popover tới tâm mục — popover neo lệch thì mũi nhọn vẫn chỉ đúng mục.
  const [caretOffset, setCaretOffset] = useState(0)
  const itemRef = useRef<HTMLLIElement>(null)
  const openTimer = useRef<number | undefined>(undefined)
  const descriptionId = useId()

  const show = () => {
    window.clearTimeout(openTimer.current)
    const rect = itemRef.current?.getBoundingClientRect()
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top - NAVBAR_CLEARANCE
      // Mặc định mở xuống — thiếu chỗ thì phần tràn vẫn cuộn tới được. Chỉ lật lên khi
      // phía trên thật sự đủ chỗ.
      setPlacement(spaceBelow < POPOVER_SPACE && spaceAbove >= POPOVER_SPACE ? 'top' : 'bottom')
      setCaretOffset(rect.width / 2)
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
      <span className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#10132E] text-xl xl:size-12 xl:text-2xl',
            href ? 'text-purple' : 'text-purple/60',
          )}
        >
          {icon}
        </span>
        {href &&
          (external ? (
            <LuArrowUpRight aria-hidden className="text-lg text-purple xl:text-xl" />
          ) : (
            <LuArrowRight aria-hidden className="text-lg text-purple xl:text-xl" />
          ))}
      </span>
      <span className="mt-4 flex flex-col items-start gap-1">
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
    </>
  )

  const itemClassName = cn(
    // Bốn mục chia đều dải: ở lg mỗi mục chỉ ~240px nên xếp dọc (icon trên, chữ dưới) —
    // dàn ngang thì dòng mô tả không còn đủ chỗ.
    'flex h-full flex-col px-4 py-5 transition-colors duration-200 xl:px-6 xl:py-6',
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
        style={align === 'start' ? { left: caretOffset } : align === 'end' ? { right: caretOffset } : undefined}
        className={cn(
          'absolute size-3 rotate-45 border-white/[0.1] bg-[rgb(8,10,32)]',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          align === 'start' && '-translate-x-1/2',
          align === 'end' && 'translate-x-1/2',
          placement === 'bottom' ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-b border-r',
        )}
      />
      <div className="relative h-[220px] overflow-hidden rounded-lg border border-white/[0.06] bg-[rgb(4,7,29)]">
        {preview}
      </div>
      <p className="mt-4 text-base leading-relaxed text-white-100">{description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        {location ? (
          <span className="truncate rounded-full bg-[#10132E] px-3 py-1.5 text-sm text-white-200">{location}</span>
        ) : (
          <span />
        )}
        {href ? (
          <span className="flex shrink-0 items-center gap-2.5 text-sm text-purple">
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
        <ProjectLink
          href={href}
          external={external}
          aria-describedby={descriptionId}
          className={cn(
            itemClassName,
            'hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple',
          )}
        >
          {content}
        </ProjectLink>
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
              'absolute z-20 w-[380px]',
              align === 'start' && 'left-0',
              align === 'center' && 'left-1/2 -translate-x-1/2',
              align === 'end' && 'right-0',
              placement === 'bottom' ? 'top-full pt-3' : 'bottom-full pb-3',
            )}
          >
            {href ? (
              <ProjectLink href={href} external={external} tabIndex={-1} className="block">
                {card}
              </ProjectLink>
            ) : (
              card
            )}
          </div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default ProjectStripItem
