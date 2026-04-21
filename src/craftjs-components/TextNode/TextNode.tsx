/**
 * TextNode — Inline-editable text block.
 * Single click = select node (Settings Panel opens).
 * Double click = enter inline edit mode (contentEditable).
 * Esc / click outside = save & exit edit mode.
 */
'use client'

import { useNode } from '@craftjs/core'
import { useCallback, useRef, useState } from 'react'

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
        <textarea
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white resize-none"
          value={props.text ?? ''}
          onChange={(e) => setProp((p: TextNodeProps) => (p.text = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Tag</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.tag ?? 'p'}
          onChange={(e) => setProp((p: TextNodeProps) => (p.tag = e.target.value as TextNodeProps['tag']))}
        >
          <option value="h1">H1 — Heading 1</option>
          <option value="h2">H2 — Heading 2</option>
          <option value="h3">H3 — Heading 3</option>
          <option value="p">P — Paragraph</option>
          <option value="span">Span — Inline</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Size (px)</label>
        <input
          type="number"
          min={8}
          max={120}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.fontSize ?? 16}
          onChange={(e) => setProp((p: TextNodeProps) => (p.fontSize = parseInt(e.target.value)))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
        <input
          type="color"
          className="w-full h-9 rounded cursor-pointer"
          value={props.color ?? '#ffffff'}
          onChange={(e) => setProp((p: TextNodeProps) => (p.color = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Font Weight</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.fontWeight ?? 'normal'}
          onChange={(e) =>
            setProp((p: TextNodeProps) => (p.fontWeight = e.target.value as TextNodeProps['fontWeight']))
          }
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Text Align</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.textAlign ?? 'left'}
          onChange={(e) =>
            setProp((p: TextNodeProps) => (p.textAlign = e.target.value as TextNodeProps['textAlign']))
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
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
