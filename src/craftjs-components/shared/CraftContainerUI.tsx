/**
 * CraftContainerUI — Pure UI cho CraftContainer, không phụ thuộc @craftjs/core.
 * Dùng trong CraftRenderer (public page SSR) cho ROOT và các cột của ColumnsLayout.
 *
 * CHÚ Ý: KHÔNG render `className` của editor (vd dashed border của cột) ra public —
 * đó là editor chrome. Chỉ áp background + padding.
 */
import React from 'react'

interface CraftContainerUIProps {
  background?: string
  padding?: number
  children?: React.ReactNode
}

export const CraftContainerUI = ({
  background = 'transparent',
  padding = 0,
  children,
}: CraftContainerUIProps) => {
  return (
    <div style={{ background, padding }} className="w-full">
      {children}
    </div>
  )
}
