import React from 'react'
import type { DividerProps } from './Divider'

export const DividerUI = ({
  style: divStyle = 'line',
  color = '#334155',
  spacing = 32,
}: DividerProps) => {
  return (
    <div
      style={{ paddingTop: spacing, paddingBottom: spacing }}
      className="w-full flex items-center justify-center px-8"
    >
      {divStyle === 'line' && (
        <div className="w-full h-px" style={{ background: color }} />
      )}
      {divStyle === 'dots' && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          ))}
        </div>
      )}
      {divStyle === 'none' && <div />}
    </div>
  )
}
