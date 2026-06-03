/**
 * Divider — Khoảng cách / đường kẻ giữa các sections.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface DividerProps {
  style?: 'line' | 'dots' | 'none'
  color?: string
  spacing?: number
}

import { DividerUI } from './DividerUI'
import { ColorField } from '../shared/ColorField'
import Select from 'antd/es/select'
import Slider from 'antd/es/slider'

export const Divider = (props: DividerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <DividerUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const DividerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as DividerProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Style</label>
        <Select
          size="small"
          className="w-full"
          value={props.style ?? 'line'}
          onChange={(v) => setProp((p: DividerProps) => (p.style = v as DividerProps['style']))}
          options={[
            { value: 'line', label: 'Line' },
            { value: 'dots', label: 'Dots' },
            { value: 'none', label: 'None (spacer)' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <ColorField
          value={props.color ?? '#334155'}
          onChange={(hex) => setProp((p: DividerProps) => (p.color = hex))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Spacing (px)</label>
        <Slider
          min={0}
          max={120}
          value={props.spacing ?? 32}
          onChange={(v) => setProp((p: DividerProps) => (p.spacing = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
    </div>
  )
}

Divider.craft = {
  displayName: 'Divider / Spacer',
  props: { style: 'line', color: '#334155', spacing: 32 },
  related: { settings: DividerSettings },
}
