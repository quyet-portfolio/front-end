/**
 * index.tsx — Registry phía EDITOR: Craft.js components (craftResolver) + palette sidebar.
 * Chỉ import từ code editor — trang public dùng uiRegistry.ts (không kéo @craftjs/core).
 * Danh sách element gốc: names.ts.
 */
import type React from 'react'
import type { CraftComponentName } from './names'
import { CraftContainer } from './shared/CraftContainer'
import { HeroSection } from './HeroSection/HeroSection'
import { AboutSection } from './AboutSection/AboutSection'
import { SkillsSection } from './SkillsSection/SkillsSection'
import { ProjectsSection } from './ProjectsSection/ProjectsSection'
import { ExperienceSection } from './ExperienceSection/ExperienceSection'
import { ContactSection } from './ContactSection/ContactSection'
import { Divider } from './Divider/Divider'
import { TextNode } from './TextNode/TextNode'
import { ColumnsLayout } from './ColumnsLayout/ColumnsLayout'
import { ButtonNode } from './ButtonNode/ButtonNode'
import { ImageNode } from './ImageNode/ImageNode'
import { IconNode } from './IconNode/IconNode'

export { CraftContainer }
export { HeroSection }
export { AboutSection }
export { SkillsSection }
export { ProjectsSection }
export { ExperienceSection }
export { ContactSection }
export { Divider }
export { TextNode }
export { ColumnsLayout }
export { ButtonNode }
export { ImageNode }
export { IconNode }

// Re-export types
export type { HeroSectionProps } from './HeroSection/HeroSection'
export type { AboutSectionProps } from './AboutSection/AboutSection'
export type { SkillsSectionProps, Skill } from './SkillsSection/SkillsSection'
export type { ProjectsSectionProps, Project } from './ProjectsSection/ProjectsSection'
export type { ExperienceSectionProps, Job } from './ExperienceSection/ExperienceSection'
export type { ContactSectionProps, SocialLink } from './ContactSection/ContactSection'
export type { DividerProps } from './Divider/Divider'
export type { TextNodeProps } from './TextNode/TextNode'
export type { ColumnsLayoutProps } from './ColumnsLayout/ColumnsLayout'
export type { ButtonNodeProps } from './ButtonNode/ButtonNode'
export type { ImageNodeProps } from './ImageNode/ImageNode'
export type { IconNodeProps } from './IconNode/IconNode'

/**
 * Map dùng trong <Editor resolver={craftResolver}>.
 * Type theo names.ts → thiếu element là tsc báo lỗi (bản UI tương ứng: uiRegistry.ts).
 */
export const craftResolver: Record<CraftComponentName, React.ElementType> = {
  CraftContainer,
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ExperienceSection,
  ContactSection,
  Divider,
  TextNode,
  ColumnsLayout,
  ButtonNode,
  ImageNode,
  IconNode,
}

// ─── Palette (sidebar trái của editor) ───────────────────────────────────────

export interface PaletteItem {
  name: CraftComponentName
  label: string
  icon: string
  description: string
  /** Element được tạo khi kéo vào canvas (có thể kèm props khởi tạo) */
  element: React.ReactElement
}

export interface PaletteGroup {
  group: string
  items: PaletteItem[]
}

export const PALETTE: PaletteGroup[] = [
  {
    group: 'Sections',
    items: [
      { name: 'HeroSection', label: 'Hero', icon: '🏠', description: 'Name, title & intro', element: <HeroSection /> },
      { name: 'AboutSection', label: 'About', icon: '👤', description: 'Bio & highlights', element: <AboutSection /> },
      { name: 'SkillsSection', label: 'Skills', icon: '⚡', description: 'Tech stack bars', element: <SkillsSection /> },
      { name: 'ProjectsSection', label: 'Projects', icon: '🗂️', description: 'Project showcase', element: <ProjectsSection /> },
      { name: 'ExperienceSection', label: 'Experience', icon: '💼', description: 'Work timeline', element: <ExperienceSection /> },
      { name: 'ContactSection', label: 'Contact', icon: '✉️', description: 'Email & socials', element: <ContactSection /> },
      { name: 'Divider', label: 'Divider', icon: '〰️', description: 'Spacer / line', element: <Divider /> },
    ],
  },
  {
    group: 'Layout',
    items: [
      { name: 'ColumnsLayout', label: '2 Columns', icon: '▥', description: 'Two-column drop zone', element: <ColumnsLayout columns={2} /> },
      { name: 'ColumnsLayout', label: '3 Columns', icon: '▦', description: 'Three-column drop zone', element: <ColumnsLayout columns={3} /> },
    ],
  },
  {
    group: 'Content',
    items: [
      { name: 'TextNode', label: 'Text', icon: 'T', description: 'Double-click to edit inline', element: <TextNode /> },
      { name: 'ButtonNode', label: 'Button', icon: '🔘', description: 'CTA button with link', element: <ButtonNode /> },
      { name: 'ImageNode', label: 'Image', icon: '🖼️', description: 'External image / photo', element: <ImageNode /> },
      { name: 'IconNode', label: 'Icon', icon: '⭐', description: 'Emoji / icon element', element: <IconNode /> },
    ],
  },
]
