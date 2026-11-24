/**
 * ComponentPanel — Sidebar trái: danh sách components có thể kéo vào canvas.
 * Danh sách lấy từ PALETTE (craftjs-components/index.tsx).
 */
'use client'

import { useEditor } from '@craftjs/core'
import { PALETTE } from '@/src/craftjs-components'

export const ComponentPanel = () => {
  const { connectors } = useEditor()

  return (
    <div className="flex flex-col gap-3 p-3">
      {PALETTE.map(({ group, items }) => (
        <div key={group}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
            {group}
          </p>
          <div className="flex flex-col gap-1">
            {items.map(({ label, icon, description, element }) => (
              <div
                key={label}
                ref={(ref) => { if (ref) connectors.create(ref, element) }}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing
                  bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800
                  transition-all duration-150 select-none"
                title={`Drag to add ${label}`}
              >
                <span className="text-base leading-none font-mono w-4 text-center text-slate-300">{icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white">{label}</p>
                  <p className="text-xs text-slate-500 truncate">{description}</p>
                </div>
                <span className="ml-auto text-slate-600 group-hover:text-slate-400 text-xs">⣿</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
