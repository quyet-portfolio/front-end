/**
 * IconNode — Draggable icon / emoji element.
 * Uses emoji characters for zero-dependency icons.
 * Customisable size, colour, alignment & optional link wrapper.
 */
'use client'

import { useNode } from '@craftjs/core'
import { IconNodeUI } from './IconNodeUI'

export interface IconNodeProps {
  icon?: string
  size?: number
  color?: string
  align?: 'left' | 'center' | 'right'
  href?: string
}

export const IconNode = (props: IconNodeProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({ isSelected: node.events.selected }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent rounded-sm' : ''}
    >
      <IconNodeUI {...props} />
    </div>
  )
}

// ─── Predefined icon suggestions ─────────────────────────────────────────────

const ICON_PRESETS = [
  '⭐', '🚀', '💡', '🔥', '✨', '💎', '🎯', '⚡',
  '🔗', '📧', '📱', '💻', '🌐', '🛠️', '📊', '🎨',
  '✅', '❤️', '👋', '🏆', '📝', '🔒', '📦', '⚙️',
]

// ─── Settings ────────────────────────────────────────────────────────────────

const IconNodeSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as IconNodeProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Icon / Emoji</label>
        <input
          type="text"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.icon ?? '⭐'}
          onChange={(e) => setProp((p: IconNodeProps) => (p.icon = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Quick Pick</label>
        <div className="flex flex-wrap gap-1.5">
          {ICON_PRESETS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setProp((p: IconNodeProps) => (p.icon = emoji))}
              className={[
                'w-8 h-8 flex items-center justify-center rounded text-base',
                'bg-slate-800 border hover:bg-slate-700 transition-colors',
                (props.icon ?? '⭐') === emoji
                  ? 'border-indigo-500 bg-indigo-900/30'
                  : 'border-slate-700',
              ].join(' ')}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Size (px)</label>
        <input
          type="range"
          min={16}
          max={96}
          value={props.size ?? 32}
          onChange={(e) => setProp((p: IconNodeProps) => (p.size = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.size ?? 32}px</span>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <input
          type="color"
          className="w-full h-9 rounded cursor-pointer"
          value={props.color ?? '#ffffff'}
          onChange={(e) => setProp((p: IconNodeProps) => (p.color = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Alignment</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.align ?? 'center'}
          onChange={(e) =>
            setProp((p: IconNodeProps) => (p.align = e.target.value as IconNodeProps['align']))
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (optional)</label>
        <input
          type="text"
          placeholder="https://…"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.href ?? ''}
          onChange={(e) => setProp((p: IconNodeProps) => (p.href = e.target.value))}
        />
      </div>
    </div>
  )
}

IconNode.craft = {
  displayName: 'Icon',
  props: {
    icon: '⭐',
    size: 32,
    color: '#ffffff',
    align: 'center',
    href: '',
  },
  related: { settings: IconNodeSettings },
}
