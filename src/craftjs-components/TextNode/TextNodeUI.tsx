/**
 * TextNodeUI — Pure UI cho TextNode, không phụ thuộc @craftjs/core.
 * Dùng trong CraftRenderer (public page SSR). Editor dùng TextNode.tsx
 * (có inline contentEditable nên không tái dùng UI này được).
 */
import React from 'react'
import type { TextNodeProps } from './TextNode'

export const TextNodeUI = ({
  text = 'Double-click to edit text',
  fontSize = 16,
  color = '#ffffff',
  fontWeight = 'normal',
  textAlign = 'left',
  tag = 'p',
}: TextNodeProps) => {
  const Tag = tag as React.ElementType

  return (
    <Tag style={{ fontSize, color, fontWeight, textAlign, whiteSpace: 'pre-wrap' }}>
      {text}
    </Tag>
  )
}
