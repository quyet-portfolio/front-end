/**
 * ColumnsLayout — Layout container chia 2 hoặc 3 cột.
 * Mỗi cột là một drop zone độc lập (isCanvas) — có thể thả bất kỳ component nào vào.
 * Dùng khi muốn sắp xếp sections theo chiều ngang.
 */
'use client'

import { useNode, Element } from '@craftjs/core'
import { CraftContainer } from '../shared/CraftContainer'

export interface ColumnsLayoutProps {
  columns?: 2 | 3
  gap?: number
}

export const ColumnsLayout = ({ columns = 2, gap = 16 }: ColumnsLayoutProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({ isSelected: node.events.selected }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      style={{ gap }}
      className={[
        'w-full grid p-2',
        columns === 3 ? 'grid-cols-3' : 'grid-cols-2',
        isSelected && 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent rounded-sm',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <Element
          key={i}
          id={`col-${i}`}
          is={CraftContainer}
          canvas
          className="min-h-[80px] border border-dashed border-slate-600/40 rounded"
        />
      ))}
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ColumnsSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ColumnsLayoutProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Columns</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.columns ?? 2}
          onChange={(e) =>
            setProp((p: ColumnsLayoutProps) => (p.columns = parseInt(e.target.value) as 2 | 3))
          }
        >
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Gap (px)</label>
        <input
          type="range"
          min={0}
          max={64}
          value={props.gap ?? 16}
          onChange={(e) => setProp((p: ColumnsLayoutProps) => (p.gap = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.gap ?? 16}px</span>
      </div>
    </div>
  )
}

ColumnsLayout.craft = {
  displayName: 'Columns Layout',
  props: { columns: 2, gap: 16 },
  related: { settings: ColumnsSettings },
}
