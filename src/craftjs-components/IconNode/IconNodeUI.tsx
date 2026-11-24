import React from 'react'
import type { IconNodeProps } from './IconNode'
import { safeUrl } from '../shared/url'

export const IconNodeUI = ({
  icon = '⭐',
  size = 32,
  color = '#ffffff',
  align = 'center',
  href = '',
}: IconNodeProps) => {
  const safeHref = safeUrl(href)
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
      {safeHref ? (
        <a href={safeHref} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
