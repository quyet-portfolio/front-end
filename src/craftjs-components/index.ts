/**
 * index.ts — Export tất cả Craft.js components.
 * Import tập trung từ đây để dùng trong <Editor resolver={...}>
 */
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

/** Map dùng trong <Editor resolver={craftResolver}> */
export const craftResolver = {
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
