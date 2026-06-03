/**
 * CraftRenderer — Lightweight renderer cho craftJson.
 * Render thuần React từ Craft.js serialized JSON.
 * KHÔNG import @craftjs/core — zero editor bundle trên public pages.
 */
import React from 'react'
import { HeroSectionUI } from '@/src/craftjs-components/HeroSection/HeroSectionUI'
import { AboutSectionUI } from '@/src/craftjs-components/AboutSection/AboutSectionUI'
import { SkillsSectionUI } from '@/src/craftjs-components/SkillsSection/SkillsSectionUI'
import { ProjectsSectionUI } from '@/src/craftjs-components/ProjectsSection/ProjectsSectionUI'
import { ExperienceSectionUI } from '@/src/craftjs-components/ExperienceSection/ExperienceSectionUI'
import { ContactSectionUI } from '@/src/craftjs-components/ContactSection/ContactSectionUI'
import { DividerUI } from '@/src/craftjs-components/Divider/DividerUI'
import { ButtonNodeUI } from '@/src/craftjs-components/ButtonNode/ButtonNodeUI'
import { ImageNodeUI } from '@/src/craftjs-components/ImageNode/ImageNodeUI'
import { IconNodeUI } from '@/src/craftjs-components/IconNode/IconNodeUI'
import { TextNodeUI } from '@/src/craftjs-components/TextNode/TextNodeUI'
import { ColumnsLayoutUI } from '@/src/craftjs-components/ColumnsLayout/ColumnsLayoutUI'
import { CraftContainerUI } from '@/src/craftjs-components/shared/CraftContainerUI'

// Map resolvedName → Component (không có Craft.js hooks, dùng props trực tiếp)
// LƯU Ý: MỌI element trong palette (ComponentPanel) PHẢI có mặt ở đây, nếu không
// trang public sẽ render null + console.warn.
const COMPONENT_MAP: Record<string, React.FC<any>> = {
  HeroSection: (props) => <HeroSectionUI {...props} />,
  AboutSection: (props) => <AboutSectionUI {...props} />,
  SkillsSection: (props) => <SkillsSectionUI {...props} />,
  ProjectsSection: (props) => <ProjectsSectionUI {...props} />,
  ExperienceSection: (props) => <ExperienceSectionUI {...props} />,
  ContactSection: (props) => <ContactSectionUI {...props} />,
  Divider: (props) => <DividerUI {...props} />,
  ButtonNode: (props) => <ButtonNodeUI {...props} />,
  ImageNode: (props) => <ImageNodeUI {...props} />,
  IconNode: (props) => <IconNodeUI {...props} />,
  TextNode: (props) => <TextNodeUI {...props} />,
  ColumnsLayout: (props) => <ColumnsLayoutUI {...props} />,
  CraftContainer: (props) => <CraftContainerUI {...props} />,
}

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
