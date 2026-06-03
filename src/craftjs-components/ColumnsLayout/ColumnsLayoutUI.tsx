/**
 * ColumnsLayoutUI — Pure UI cho ColumnsLayout, không phụ thuộc @craftjs/core.
 * Dùng trong CraftRenderer (public page SSR).
 *
 * Mỗi cột là một canvas con (CraftContainer) lưu trong `linkedNodes` của node,
 * KHÔNG phải `node.nodes`. CraftRenderer resolve các linkedNode thành
 * `linkedChildren` keyed theo slot id ("col-0", "col-1", ...) rồi truyền vào đây.
 */
import React from 'react'
import type { ColumnsLayoutProps } from './ColumnsLayout'

interface ColumnsLayoutUIProps extends ColumnsLayoutProps {
  /** Nội dung từng cột đã render, keyed "col-0" / "col-1" / ... — inject bởi CraftRenderer */
  linkedChildren?: Record<string, React.ReactNode>
}

export const ColumnsLayoutUI = ({
  columns = 2,
  gap = 16,
  linkedChildren = {},
}: ColumnsLayoutUIProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gap,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
      className="w-full p-2"
    >
      {Array.from({ length: columns }).map((_, i) => (
        // min-w-0 chống grid item phình theo min-content (blueprint §16)
        <div key={i} className="min-w-0">
          {linkedChildren[`col-${i}`] ?? null}
        </div>
      ))}
    </div>
  )
}
