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
  /** secondary dùng nền kính giống navbar để hai CTA cạnh nhau có thứ bậc rõ ràng. */
  variant?: 'primary' | 'secondary'
  className?: string
}

const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
  href,
  variant = 'primary',
  className,
}: TMagicButton) => {
  const Tag = href ? 'a' : 'button'
  const isSecondary = variant === 'secondary'

  return (
    <Tag
      href={href}
      onClick={handleClick}
      className={cn(
        'relative inline-flex h-12 w-full md:w-60 md:mt-10 overflow-hidden rounded-lg p-[1px]',
        // Bỏ outline mặc định nhưng trả lại ring rõ ràng cho người dùng bàn phím.
        'focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-black-100',
        className,
      )}
    >
      {isSecondary ? (
        <span className="absolute inset-0 rounded-lg border border-white/[0.125] bg-black-200 backdrop-blur-md backdrop-saturate-150" />
      ) : (
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      )}
      <span
        className={cn(
          'inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg',
          'px-7 text-sm font-medium text-white gap-2',
          isSecondary ? 'bg-transparent' : 'bg-slate-950 backdrop-blur-3xl',
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
