/**
 * CraftContainer — Generic droppable container.
 * Dùng làm ROOT canvas hoặc layout wrapper cho các section.
 */
'use client'

import { useNode, Element } from '@craftjs/core'

interface CraftContainerProps {
  background?: string
  padding?: number
  children?: React.ReactNode
  className?: string
}

export const CraftContainer = ({
  background = 'transparent',
  padding = 0,
  children,
  className = '',
}: CraftContainerProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      style={{ background, padding }}
      className={[
        'w-full min-h-[40px]',
        className,
        isSelected && 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

const CraftContainerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as CraftContainerProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Background</label>
        <input
          type="color"
          value={props.background || '#transparent'}
          onChange={(e) => setProp((p: CraftContainerProps) => (p.background = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Padding (px)</label>
        <input
          type="range"
          min={0}
          max={80}
          value={props.padding ?? 0}
          onChange={(e) =>
            setProp((p: CraftContainerProps) => (p.padding = parseInt(e.target.value)))
          }
          className="w-full"
        />
        <span className="text-xs text-slate-500">{props.padding ?? 0}px</span>
      </div>
    </div>
  )
}

CraftContainer.craft = {
  displayName: 'Container',
  props: { background: 'transparent', padding: 0 },
  isCanvas: true,
  related: { settings: CraftContainerSettings },
}
