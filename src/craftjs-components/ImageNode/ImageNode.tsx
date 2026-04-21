/**
 * ImageNode — Draggable image element.
 * Supports external URL, sizing, object-fit, border-radius & optional link wrapper.
 */
'use client'

import { useNode } from '@craftjs/core'
import { ImageNodeUI } from './ImageNodeUI'

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
        <input
          type="text"
          placeholder="https://…"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.src ?? ''}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.src = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Alt Text</label>
        <input
          type="text"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.alt ?? ''}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.alt = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Width</label>
        <input
          type="text"
          placeholder="100% or 300px"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.width ?? '100%'}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.width = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Height</label>
        <input
          type="text"
          placeholder="auto or 200px"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.height ?? 'auto'}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.height = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Object Fit</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.objectFit ?? 'cover'}
          onChange={(e) =>
            setProp((p: ImageNodeProps) => (p.objectFit = e.target.value as ImageNodeProps['objectFit']))
          }
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Border Radius (px)</label>
        <input
          type="range"
          min={0}
          max={50}
          value={props.borderRadius ?? 0}
          onChange={(e) => setProp((p: ImageNodeProps) => (p.borderRadius = parseInt(e.target.value)))}
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.borderRadius ?? 0}px</span>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Link (optional)</label>
        <input
          type="text"
          placeholder="https://…"
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
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
