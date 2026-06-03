/**
 * ButtonNode — Draggable button element.
 * Customisable label, link, variant, colour, size & border-radius.
 */
'use client'

import { useNode } from '@craftjs/core'
import { ButtonNodeUI } from './ButtonNodeUI'
import { ColorField } from '../shared/ColorField'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import InputNumber from 'antd/es/input-number'
import Slider from 'antd/es/slider'
import Checkbox from 'antd/es/checkbox'

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
        <Input
          size="small"
          value={props.text ?? 'Click me'}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.text = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (URL)</label>
        <Input
          size="small"
          placeholder="https://…"
          value={props.href ?? ''}
          onChange={(e) => setProp((p: ButtonNodeProps) => (p.href = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Variant</label>
        <Select
          size="small"
          className="w-full"
          value={props.variant ?? 'solid'}
          onChange={(v) => setProp((p: ButtonNodeProps) => (p.variant = v as ButtonNodeProps['variant']))}
          options={[
            { value: 'solid', label: 'Solid' },
            { value: 'outline', label: 'Outline' },
            { value: 'ghost', label: 'Ghost' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Background Color</label>
        <ColorField
          value={props.color ?? '#6366f1'}
          onChange={(hex) => setProp((p: ButtonNodeProps) => (p.color = hex))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Text Color</label>
        <ColorField
          value={props.textColor ?? '#ffffff'}
          onChange={(hex) => setProp((p: ButtonNodeProps) => (p.textColor = hex))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Size (px)</label>
        <InputNumber
          size="small"
          className="w-full"
          min={10}
          max={32}
          value={props.fontSize ?? 14}
          onChange={(v) => setProp((p: ButtonNodeProps) => (p.fontSize = v ?? 14))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Padding X (px)</label>
        <Slider
          min={8}
          max={64}
          value={props.paddingX ?? 24}
          onChange={(v) => setProp((p: ButtonNodeProps) => (p.paddingX = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Padding Y (px)</label>
        <Slider
          min={4}
          max={24}
          value={props.paddingY ?? 10}
          onChange={(v) => setProp((p: ButtonNodeProps) => (p.paddingY = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Border Radius (px)</label>
        <Slider
          min={0}
          max={50}
          value={props.borderRadius ?? 8}
          onChange={(v) => setProp((p: ButtonNodeProps) => (p.borderRadius = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
      <Checkbox
        checked={props.fullWidth ?? false}
        onChange={(e) => setProp((p: ButtonNodeProps) => (p.fullWidth = e.target.checked))}
      >
        <span className="text-xs font-semibold text-slate-400">Full Width</span>
      </Checkbox>
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
