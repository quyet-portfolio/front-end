/**
 * ImageNode — Draggable image element.
 * Supports external URL, sizing, object-fit, border-radius & optional link wrapper.
 */
'use client'

import { useNode } from '@craftjs/core'
import { ImageNodeUI } from './ImageNodeUI'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import Slider from 'antd/es/slider'

export interface ImageNodeProps {
  src?: string
  alt?: string
  width?: string
  height?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  borderRadius?: number
  href?: string
}

export const ImageNode = (props: ImageNodeProps) => {
  const {
    connectors: { connect, drag },
    isSelected,
  } = useNode((node) => ({ isSelected: node.events.selected }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent rounded-sm' : ''}
    >
      <ImageNodeUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ImageNodeSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ImageNodeProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Image URL</label>
        <Input
          size="small"
          placeholder="https://…"
          value={props.src ?? ''}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.src = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Alt Text</label>
        <Input
          size="small"
          value={props.alt ?? ''}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.alt = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Width</label>
        <Input
          size="small"
          placeholder="100% or 300px"
          value={props.width ?? '100%'}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.width = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Height</label>
        <Input
          size="small"
          placeholder="auto or 200px"
          value={props.height ?? 'auto'}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.height = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Object Fit</label>
        <Select
          size="small"
          className="w-full"
          value={props.objectFit ?? 'cover'}
          onChange={(v) => setProp((p: ImageNodeProps) => (p.objectFit = v as ImageNodeProps['objectFit']))}
          options={[
            { value: 'cover', label: 'Cover' },
            { value: 'contain', label: 'Contain' },
            { value: 'fill', label: 'Fill' },
            { value: 'none', label: 'None' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Border Radius (px)</label>
        <Slider
          min={0}
          max={50}
          value={props.borderRadius ?? 0}
          onChange={(v) => setProp((p: ImageNodeProps) => (p.borderRadius = v))}
          tooltip={{ formatter: (v) => `${v}px` }}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (optional)</label>
        <Input
          size="small"
          placeholder="https://…"
          value={props.href ?? ''}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.href = e.target.value))}
        />
      </div>
    </div>
  )
}

ImageNode.craft = {
  displayName: 'Image',
  props: {
    src: 'https://placehold.co/600x400/1e293b/94a3b8?text=Image',
    alt: 'Placeholder image',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    href: '',
  },
  related: { settings: ImageNodeSettings },
}
