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
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.style ?? 'line'}
          onChange={(e) =>
            setProp((p: DividerProps) => (p.style = e.target.value as DividerProps['style']))
          }
        >
          <option value="line">Line</option>
          <option value="dots">Dots</option>
          <option value="none">None (spacer)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <input
          type="color"
          value={props.color ?? '#334155'}
          onChange={(e) => setProp((p: DividerProps) => (p.color = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Spacing (px)</label>
        <input
          type="range"
          min={0}
          max={120}
          value={props.spacing ?? 32}
          onChange={(e) => setProp((p: DividerProps) => (p.spacing = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.spacing ?? 32}px</span>
      </div>
    </div>
  )
}

Divider.craft = {
  displayName: 'Divider / Spacer',
  props: { style: 'line', color: '#334155', spacing: 32 },
  related: { settings: DividerSettings },
}
