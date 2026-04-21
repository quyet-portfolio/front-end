/**
 * ButtonNode — Draggable button element.
 * Customisable label, link, variant, colour, size & border-radius.
 */
'use client'

import { useNode } from '@craftjs/core'
import { ButtonNodeUI } from './ButtonNodeUI'

export interface ButtonNodeProps {
  text?: string
  href?: string
  variant?: 'solid' | 'outline' | 'ghost'
  color?: string
  textColor?: string
  fontSize?: number
  paddingX?: number
  paddingY?: number
  borderRadius?: number
  fullWidth?: boolean
}

export const ButtonNode = (props: ButtonNodeProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({ isSelected: node.events.selected }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent rounded-sm' : ''}
    >
      <ButtonNodeUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ButtonNodeSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ButtonNodeProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Label</label>
        <input
          type="text"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.text ?? 'Click me'}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.text = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (URL)</label>
        <input
          type="text"
          placeholder="https://…"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.href ?? ''}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.href = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Variant</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.variant ?? 'solid'}
          onChange={(e) =>
            setProp((p: ButtonNodeProps) => (p.variant = e.target.value as ButtonNodeProps['variant']))
          }
        >
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Background Color</label>
        <input
          type="color"
          className="w-full h-9 rounded cursor-pointer"
          value={props.color ?? '#6366f1'}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.color = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Text Color</label>
        <input
          type="color"
          className="w-full h-9 rounded cursor-pointer"
          value={props.textColor ?? '#ffffff'}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.textColor = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Size (px)</label>
        <input
          type="number"
          min={10}
          max={32}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.fontSize ?? 14}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.fontSize = parseInt(e.target.value)))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Padding X (px)</label>
        <input
          type="range"
          min={8}
          max={64}
          value={props.paddingX ?? 24}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.paddingX = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.paddingX ?? 24}px</span>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Padding Y (px)</label>
        <input
          type="range"
          min={4}
          max={24}
          value={props.paddingY ?? 10}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.paddingY = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.paddingY ?? 10}px</span>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Border Radius (px)</label>
        <input
          type="range"
          min={0}
          max={50}
          value={props.borderRadius ?? 8}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.borderRadius = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.borderRadius ?? 8}px</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="btn-fullwidth"
          checked={props.fullWidth ?? false}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.fullWidth = e.target.checked))}
          className="rounded bg-slate-800 border-slate-700"
        />
        <label htmlFor="btn-fullwidth" className="text-xs font-semibold text-slate-400">Full Width</label>
      </div>
    </div>
  )
}

ButtonNode.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    href: '',
    variant: 'solid',
    color: '#6366f1',
    textColor: '#ffffff',
    fontSize: 14,
    paddingX: 24,
    paddingY: 10,
    borderRadius: 8,
    fullWidth: false,
  },
  related: { settings: ButtonNodeSettings },
}
