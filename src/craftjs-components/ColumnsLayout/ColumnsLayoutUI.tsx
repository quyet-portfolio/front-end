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

/**
 * Khung hẹp (điện thoại / canvas Mobile) → xếp chồng 1 cột; từ 768px mới chia cột.
 * Breakpoint theo khung chứa (pf-md) — dùng chung với ColumnsLayout trong editor.
 */
export const columnsClass = (columns: number) =>
  columns === 3 ? 'grid grid-cols-1 pf-md:grid-cols-3' : 'grid grid-cols-1 pf-md:grid-cols-2'

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
    <div style={{ gap }} className={`w-full max-w-6xl mx-auto p-2 ${columnsClass(columns)}`}>
      {Array.from({ length: columns }).map((_, i) => (
        // min-w-0 chống grid item phình theo min-content (blueprint §16)
        <div key={i} className="min-w-0">
          {linkedChildren[`col-${i}`] ?? null}
        </div>
      ))}
    </div>
  )
}
