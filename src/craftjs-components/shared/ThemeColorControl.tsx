/**
 * ThemeColorControl — Color picker dùng trong Settings panel với 2 chế độ:
 *  - "Following theme": prop undefined → element dùng màu Global Theme (CSS var).
 *  - "Custom override": prop có giá trị hex → element dùng màu riêng, thắng theme.
 *
 * Bấm "Customize" → set override = fallback hex. Bấm "↺ Theme" → clear (undefined),
 * không serialize → element quay về follow theme. Swatch màu theme thật hiển thị
 * trên canvas (đã inject CSS var), control này chỉ bật/tắt override.
 */
'use client'

import React from 'react'
import { ColorField } from './ColorField'
import Button from 'antd/es/button'

interface ThemeColorControlProps {
  label: string
  value?: string
  /** Hex mặc định khi user bấm Customize (thường = hard fallback của UI) */
  fallback: string
  onChange: (value: string | undefined) => void
}

export const ThemeColorControl = ({ label, value, fallback, onChange }: ThemeColorControlProps) => {
  const following = value === undefined || value === ''

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-slate-400">{label}</label>
        {following ? (
          <Button
            type="link"
            size="small"
            onClick={() => onChange(fallback)}
            style={{ padding: 0, height: 'auto', fontSize: 10 }}
          >
            Customize
          </Button>
        ) : (
          <Button
            type="link"
            size="small"
            onClick={() => onChange(undefined)}
            style={{ padding: 0, height: 'auto', fontSize: 10 }}
          >
            ↺ Theme
          </Button>
        )}
      </div>
      {following ? (
        <div className="w-full h-9 rounded border border-dashed border-slate-600 flex items-center justify-center text-[11px] text-slate-500">
          Following global theme
        </div>
      ) : (
        <ColorField value={value} onChange={onChange} />
      )}
    </div>
  )
}
