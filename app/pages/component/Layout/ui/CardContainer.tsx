'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type TCardContainer = {
  children: React.ReactNode
  title?: string
  href?: string
  className?: string
  containerClassName?: string
}

const CardContainer = ({ children, className, containerClassName }: TCardContainer) => {
  const [transform, setTransform] = useState('translate(-50%,-50%) rotateX(0deg)')

  const onMouseEnter = () => {
    setTransform('translate(-50%,-50%) rotateX(0deg) scale(1.1)')
  }
  const onMouseLeave = () => {
    setTransform('translate(-50%,-50%) rotateX(0deg) scale(1)')
  }
  return (
    <div
      className={cn('relative group/pin z-50  cursor-pointer', containerClassName)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute left-1/2 top-1/2">
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 p-4 top-1/2  flex justify-start items-start  rounded-2xl  border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-500 overflow-hidden"
        >
          <div className={cn(' relative z-50 ', className)}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default CardContainer
