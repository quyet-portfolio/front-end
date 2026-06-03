/**
 * ColumnsLayout — Layout container chia 2 hoặc 3 cột.
 * Mỗi cột là một drop zone độc lập (isCanvas) — có thể thả bất kỳ component nào vào.
 * Dùng khi muốn sắp xếp sections theo chiều ngang.
 */
'use client'

import { useNode, Element } from '@craftjs/core'
import { CraftContainer } from '../shared/CraftContainer'
import Select from 'antd/es/select'
import Slider from 'antd/es/slider'

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
        <Select
          size="small"
          className="w-full"
          value={props.columns ?? 2}
          onChange={(v) => setProp((p: ColumnsLayoutProps) => (p.columns = v as 2 | 3))}
          options={[
            { value: 2, label: '2 Columns' },
            { value: 3, label: '3 Columns' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Gap (px)</label>
        <Slider
          min={0}
          max={64}
          value={props.gap ?? 16}
          onChange={(v) => setProp((p: ColumnsLayoutProps) => (p.gap = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
    </div>
  )
}

ColumnsLayout.craft = {
  displayName: 'Columns Layout',
  props: { columns: 2, gap: 16 },
  related: { settings: ColumnsSettings },
}
