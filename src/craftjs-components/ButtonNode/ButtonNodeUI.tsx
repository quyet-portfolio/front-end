import React from 'react'
import type { ButtonNodeProps } from './ButtonNode'

export const ButtonNodeUI = ({
  text = 'Click me',
  href = '',
  variant = 'solid',
  color = '#6366f1',
  textColor = '#ffffff',
  fontSize = 14,
  paddingX = 24,
  paddingY = 10,
  borderRadius = 8,
  fullWidth = false,
}: ButtonNodeProps) => {
  const baseStyle: React.CSSProperties = {
    fontSize,
    borderRadius,
    padding: `${paddingY}px ${paddingX}px`,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-block',
    textAlign: 'center',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    textDecoration: 'none',
    border: '2px solid transparent',
  }

  if (variant === 'solid') {
    baseStyle.background = color
    baseStyle.color = textColor
  } else if (variant === 'outline') {
    baseStyle.background = 'transparent'
    baseStyle.color = color
    baseStyle.borderColor = color
  } else {
    // ghost
    baseStyle.background = 'transparent'
    baseStyle.color = color
  }

  const Tag = href ? 'a' : 'span'
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Tag style={baseStyle} {...linkProps}>
      {text}
    </Tag>
  )
}
