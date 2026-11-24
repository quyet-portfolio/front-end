/**
 * uiRegistry.ts — resolvedName → UI thuần (không phụ thuộc @craftjs/core).
 * Dùng bởi CraftRenderer (trang public SSR + preview). Type theo names.ts nên
 * thiếu element nào là tsc báo lỗi.
 */
import type React from 'react'
import type { CraftComponentName } from './names'
import { HeroSectionUI } from './HeroSection/HeroSectionUI'
import { AboutSectionUI } from './AboutSection/AboutSectionUI'
import { SkillsSectionUI } from './SkillsSection/SkillsSectionUI'
import { ProjectsSectionUI } from './ProjectsSection/ProjectsSectionUI'
import { ExperienceSectionUI } from './ExperienceSection/ExperienceSectionUI'
import { ContactSectionUI } from './ContactSection/ContactSectionUI'
import { DividerUI } from './Divider/DividerUI'
import { ButtonNodeUI } from './ButtonNode/ButtonNodeUI'
import { ImageNodeUI } from './ImageNode/ImageNodeUI'
import { IconNodeUI } from './IconNode/IconNodeUI'
import { TextNodeUI } from './TextNode/TextNodeUI'
import { ColumnsLayoutUI } from './ColumnsLayout/ColumnsLayoutUI'
import { CraftContainerUI } from './shared/CraftContainerUI'

export const UI_REGISTRY: Record<CraftComponentName, React.ComponentType<any>> = {
  CraftContainer: CraftContainerUI,
  HeroSection: HeroSectionUI,
  AboutSection: AboutSectionUI,
  SkillsSection: SkillsSectionUI,
  ProjectsSection: ProjectsSectionUI,
  ExperienceSection: ExperienceSectionUI,
  ContactSection: ContactSectionUI,
  Divider: DividerUI,
  TextNode: TextNodeUI,
  ColumnsLayout: ColumnsLayoutUI,
  ButtonNode: ButtonNodeUI,
  ImageNode: ImageNodeUI,
  IconNode: IconNodeUI,
}
