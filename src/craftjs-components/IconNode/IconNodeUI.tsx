import React from 'react'
import type { IconNodeProps } from './IconNode'

export const IconNodeUI = ({
  icon = '⭐',
  size = 32,
  color = '#ffffff',
  align = 'center',
  href = '',
}: IconNodeProps) => {
  const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' } as const

  const content = (
    <span
      style={{ fontSize: size, color, lineHeight: 1 }}
      role="img"
      aria-label={icon}
    >
      {icon}
    </span>
  )

  return (
    <div style={{ display: 'flex', justifyContent: justifyMap[align] }}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
