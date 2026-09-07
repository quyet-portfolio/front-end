'use client'

import { cn } from '@/src/lib/utils'
import React from 'react'

type TMagicButton = {
  title: string
  icon: React.ReactNode
  position: string
  handleClick?: () => void
  otherClasses?: string
  /** Khi có href sẽ render <a> thay vì <button>, tránh lồng button trong anchor. */
  href?: string
}

const MagicButton = ({ title, icon, position, handleClick, otherClasses, href }: TMagicButton) => {
  const Tag = href ? 'a' : 'button'

  return (
    <Tag
      href={href}
      onClick={handleClick}
      className={cn(
        'relative inline-flex h-12 w-full md:w-60 md:mt-10 overflow-hidden rounded-lg p-[1px]',
        // Bỏ outline mặc định nhưng trả lại ring rõ ràng cho người dùng bàn phím.
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-black-100',
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span
        className={cn(
          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg',
          'bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2',
          otherClasses,
        )}
      >
        {position === 'left' && icon}
        {title}
        {position === 'right' && icon}
      </span>
    </Tag>
  )
}

export default MagicButton
