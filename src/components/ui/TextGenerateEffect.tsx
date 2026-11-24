'use client'

import { cn } from '@/src/lib/utils'
import { stagger, useAnimate, motion } from 'framer-motion'
import React, { useEffect } from 'react'

type TTextGenerateEffect = {
  words: string
  className?: string
  /** Thẻ bọc — Hero truyền "h1" để trang có đúng một heading cấp 1. */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}

const TextGenerateEffect = ({ words, className, as: Tag = 'div' }: TTextGenerateEffect) => {
  const [scope, animate] = useAnimate()
  const wordsArray = words.split(' ')

  useEffect(() => {
    // Đọc trong effect (không phải lúc render) để không lệch hydration giữa server và client.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    animate('span', { opacity: 1 }, prefersReduced ? { duration: 0 } : { duration: 2, delay: stagger(0.2) })
  }, [animate])

  return (
    <Tag
      ref={scope}
      data-text-generate
      className={cn('font-bold my-4 leading-snug tracking-wide text-white', className)}
    >
      {wordsArray.map((word, idx) => (
        <motion.span key={word + idx} className={cn('opacity-0', idx > 3 && 'text-purple')}>
          {word}{' '}
        </motion.span>
      ))}
    </Tag>
  )
}

export default TextGenerateEffect
