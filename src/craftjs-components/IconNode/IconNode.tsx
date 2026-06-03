/**
 * IconNode — Draggable icon / emoji element.
 * Uses emoji characters for zero-dependency icons.
 * Customisable size, colour, alignment & optional link wrapper.
 */
'use client'

import { useNode } from '@craftjs/core'
import { IconNodeUI } from './IconNodeUI'
import { ColorField } from '../shared/ColorField'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import Slider from 'antd/es/slider'
import Button from 'antd/es/button'

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
        <Input
          size="small"
          value={props.icon ?? '⭐'}
          onChange={(e) => setProp((p: IconNodeProps) => (p.icon = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">Quick Pick</label>
        <div className="flex flex-wrap gap-1.5">
          {ICON_PRESETS.map((emoji) => (
            <Button
              key={emoji}
              size="small"
              type={(props.icon ?? '⭐') === emoji ? 'primary' : 'default'}
              onClick={() => setProp((p: IconNodeProps) => (p.icon = emoji))}
              style={{ width: 32, height: 32, padding: 0 }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Size (px)</label>
        <Slider
          min={16}
          max={96}
          value={props.size ?? 32}
          onChange={(v) => setProp((p: IconNodeProps) => (p.size = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <ColorField
          value={props.color ?? '#ffffff'}
          onChange={(hex) => setProp((p: IconNodeProps) => (p.color = hex))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Alignment</label>
        <Select
          size="small"
          className="w-full"
          value={props.align ?? 'center'}
          onChange={(v) => setProp((p: IconNodeProps) => (p.align = v as IconNodeProps['align']))}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (optional)</label>
        <Input
          size="small"
          placeholder="https://…"
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
