/**
 * SettingsPanel — Sidebar phải: Settings của element đang được chọn.
 * Sử dụng Craft.js query API (v0.2.x): query.getEvent('selected').first()
 */
'use client'

import { useEditor } from '@craftjs/core'

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').first()
    if (!currentNodeId) return { selected: null }

    const node = state.nodes[currentNodeId]
    if (!node) return { selected: null }

    return {
      selected: {
        id: currentNodeId,
        displayName: node.data.displayName,
        settings: node.related?.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      },
    }
  })

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-2xl">
          🎯
        </div>
        <p className="text-sm text-slate-400">
          Click any element on the canvas to edit its properties.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Editing</p>
          <p className="text-sm font-semibold text-white">{selected.displayName}</p>
        </div>
        {selected.isDeletable && selected.id && (
          <button
            onClick={() => {
              try {
                actions.delete(selected.id)
              } catch (e) {
                console.error('Delete failed:', e, 'nodeId:', selected.id)
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2 py-1 rounded transition-colors"
            title="Delete element"
          >
            Delete
          </button>
        )}
      </div>

      {/* Hint cho TextNode */}
      {selected.displayName === 'Text' && (
        <div className="mx-3 mt-3 px-3 py-2 bg-indigo-900/30 border border-indigo-700/40 rounded text-xs text-indigo-300">
          💡 Double-click the text on canvas to edit inline
        </div>
      )}

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        {selected.settings ? (
          <selected.settings />
        ) : (
          <div className="p-4 text-sm text-slate-500">No settings available for this element.</div>
        )}
      </div>
    </div>
  )
}
