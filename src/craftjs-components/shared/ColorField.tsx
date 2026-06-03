/**
 * ColorField — Wrapper antd ColorPicker với API đơn giản (value hex / onChange hex).
 * Dùng cho mọi color picker trong Settings panel (outer document — antd OK,
 * KHÔNG dùng trong canvas iframe). Thay thế toàn bộ <input type="color"> cũ.
 */
'use client'

import React from 'react'
import ColorPicker from 'antd/es/color-picker'

interface ColorFieldProps {
  value?: string
  onChange: (hex: string) => void
  /** Cho phép clear về rỗng (vd nền trong suốt). onChange trả '' khi clear. */
  allowClear?: boolean
}

export const ColorField = ({ value, onChange, allowClear }: ColorFieldProps) => {
  return (
    <ColorPicker
      value={value || null}
      disabledAlpha
      showText
      allowClear={allowClear}
      size="small"
      onChange={(_, hex) => onChange(hex)}
      onClear={() => onChange('')}
      style={{ width: '100%', justifyContent: 'flex-start' }}
    />
  )
}
