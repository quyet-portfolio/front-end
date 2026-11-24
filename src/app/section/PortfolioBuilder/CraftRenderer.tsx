/**
 * CraftRenderer — Lightweight renderer cho craftJson.
 * Render thuần React từ Craft.js serialized JSON.
 * KHÔNG import @craftjs/core — zero editor bundle trên public pages.
 */
import React from 'react'
import { UI_REGISTRY } from '@/src/craftjs-components/uiRegistry'

// resolvedName → UI thuần (không có Craft.js hooks). Registry được type theo
// craftjs-components/names.ts nên không thể thiếu element so với editor.
const COMPONENT_MAP: Record<string, React.ComponentType<any>> = UI_REGISTRY

interface CraftNode {
  type: { resolvedName: string }
  props: Record<string, any>
  nodes?: string[]
  /** Canvas con khai báo qua <Element id="..."> (vd cột của ColumnsLayout) */
  linkedNodes?: Record<string, string>
  displayName?: string
}

interface CraftRendererProps {
  craftJson: Record<string, CraftNode>
}

/** Render một node và children của nó một cách đệ quy */
function renderNode(
  nodeId: string,
  nodes: Record<string, CraftNode>
): React.ReactNode {
  const node = nodes[nodeId]
  if (!node) return null

  const { resolvedName } = node.type
  const Component = COMPONENT_MAP[resolvedName]

  if (!Component) {
    console.warn(`CraftRenderer: unknown component "${resolvedName}"`)
    return null
  }

  const children = (node.nodes ?? []).map((childId) =>
    renderNode(childId, nodes)
  )

  // Canvas con trong linkedNodes (vd ColumnsLayout: { "col-0": id, "col-1": id }).
  // Resolve thành map slot → subtree đã render; ColumnsLayoutUI tiêu thụ qua prop này.
  const linkedChildren: Record<string, React.ReactNode> = {}
  for (const [slot, childId] of Object.entries(node.linkedNodes ?? {})) {
    linkedChildren[slot] = renderNode(childId, nodes)
  }

  return (
    <Component key={nodeId} {...node.props} linkedChildren={linkedChildren}>
      {children.length > 0 ? children : undefined}
    </Component>
  )
}

export const CraftRenderer = ({ craftJson }: CraftRendererProps) => {
  if (!craftJson || !craftJson['ROOT']) {
    return <div>No content</div>
  }

  return <>{renderNode('ROOT', craftJson)}</>
}
