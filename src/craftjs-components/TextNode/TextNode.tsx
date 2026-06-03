/**
 * TextNode — Inline-editable text block.
 * Single click = select node (Settings Panel opens).
 * Double click = enter inline edit mode (contentEditable).
 * Esc / click outside = save & exit edit mode.
 */
'use client'

import { useNode } from '@craftjs/core'
import { useCallback, useRef, useState } from 'react'
import { ColorField } from '../shared/ColorField'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import InputNumber from 'antd/es/input-number'

export interface TextNodeProps {
  text?: string
  fontSize?: number
  color?: string
  fontWeight?: 'normal' | 'bold'
  textAlign?: 'left' | 'center' | 'right'
  tag?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
}

export const TextNode = ({
  text = 'Double-click to edit text',
  fontSize = 16,
  color = '#ffffff',
  fontWeight = 'normal',
  textAlign = 'left',
  tag = 'p',
}: TextNodeProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    isSelected,
  } = useNode((node) => ({ isSelected: node.events.selected }))

  const [editing, setEditing] = useState(false)
  const elRef = useRef<HTMLElement>(null)

  // Attach Craft.js connectors — skip drag while editing to avoid conflicts
  const setRef = useCallback(
    (el: HTMLElement | null) => {
      ;(elRef as React.MutableRefObject<HTMLElement | null>).current = el
      if (!el) return
      editing ? connect(el) : connect(drag(el))
    },
    [connect, drag, editing],
  )

  const enterEditing = () => {
    setEditing(true)
    requestAnimationFrame(() => {
      const el = elRef.current
      if (!el) return
      el.focus()
      // Move cursor to end
      const range = document.createRange()
      range.selectNodeContents(el)
      range.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    })
  }

  const exitEditing = (e: React.FocusEvent<HTMLElement>) => {
    setEditing(false)
    const newText = e.currentTarget.innerText
    if (newText !== text) {
      setProp((p: TextNodeProps) => (p.text = newText))
    }
  }

  const Tag = tag as React.ElementType

  return (
    <Tag
      ref={setRef as unknown as React.Ref<HTMLParagraphElement>}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={enterEditing}
      onBlur={exitEditing}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Escape') (e.currentTarget as HTMLElement).blur()
        // Prevent Craft.js from catching Delete/Backspace during editing
        if (editing) e.stopPropagation()
      }}
      style={{ fontSize, color, fontWeight, textAlign, outline: 'none' }}
      className={[
        'min-w-[20px] cursor-default select-none whitespace-pre-wrap',
        editing && 'cursor-text select-text',
        isSelected && !editing && 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent rounded-sm',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {text}
    </Tag>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const TextNodeSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as TextNodeProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Text</label>
        <Input.TextArea
          rows={3}
          value={props.text ?? ''}
          onChange={(e) => setProp((p: TextNodeProps) => (p.text = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Tag</label>
        <Select
          size="small"
          className="w-full"
          value={props.tag ?? 'p'}
          onChange={(v) => setProp((p: TextNodeProps) => (p.tag = v as TextNodeProps['tag']))}
          options={[
            { value: 'h1', label: 'H1 — Heading 1' },
            { value: 'h2', label: 'H2 — Heading 2' },
            { value: 'h3', label: 'H3 — Heading 3' },
            { value: 'p', label: 'P — Paragraph' },
            { value: 'span', label: 'Span — Inline' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Size (px)</label>
        <InputNumber
          size="small"
          className="w-full"
          min={8}
          max={120}
          value={props.fontSize ?? 16}
          onChange={(v) => setProp((p: TextNodeProps) => (p.fontSize = v ?? 16))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <ColorField
          value={props.color ?? '#ffffff'}
          onChange={(hex) => setProp((p: TextNodeProps) => (p.color = hex))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Weight</label>
        <Select
          size="small"
          className="w-full"
          value={props.fontWeight ?? 'normal'}
          onChange={(v) => setProp((p: TextNodeProps) => (p.fontWeight = v as TextNodeProps['fontWeight']))}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
          ]}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Text Align</label>
        <Select
          size="small"
          className="w-full"
          value={props.textAlign ?? 'left'}
          onChange={(v) => setProp((p: TextNodeProps) => (p.textAlign = v as TextNodeProps['textAlign']))}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </div>
    </div>
  )
}

TextNode.craft = {
  displayName: 'Text',
  props: {
    text: 'Double-click to edit text',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'normal',
    textAlign: 'left',
    tag: 'p',
  },
  related: { settings: TextNodeSettings },
}
