/**
 * ComponentPanel — Sidebar trái: danh sách components có thể kéo vào canvas.
 */
'use client'

import { useEditor, Element } from '@craftjs/core'
import {
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
} from '@/src/craftjs-components'

interface ComponentItem {
  label: string
  icon: string
  description: string
  component: React.ReactElement
}

interface ComponentGroup {
  group: string
  items: ComponentItem[]
}

const componentGroups: ComponentGroup[] = [
  {
    group: 'Sections',
    items: [
      { label: 'Hero', icon: '🏠', description: 'Name, title & intro', component: <HeroSection /> },
      { label: 'About', icon: '👤', description: 'Bio & highlights', component: <AboutSection /> },
      { label: 'Skills', icon: '⚡', description: 'Tech stack bars', component: <SkillsSection /> },
      { label: 'Projects', icon: '🗂️', description: 'Project showcase', component: <ProjectsSection /> },
      { label: 'Experience', icon: '💼', description: 'Work timeline', component: <ExperienceSection /> },
      { label: 'Contact', icon: '✉️', description: 'Email & socials', component: <ContactSection /> },
      { label: 'Divider', icon: '〰️', description: 'Spacer / line', component: <Divider /> },
    ],
  },
  {
    group: 'Layout',
    items: [
      {
        label: '2 Columns',
        icon: '▥',
        description: 'Two-column drop zone',
        component: <ColumnsLayout columns={2} />,
      },
      {
        label: '3 Columns',
        icon: '▦',
        description: 'Three-column drop zone',
        component: <ColumnsLayout columns={3} />,
      },
    ],
  },
  {
    group: 'Content',
    items: [
      {
        label: 'Text',
        icon: 'T',
        description: 'Double-click to edit inline',
        component: <TextNode />,
      },
      {
        label: 'Button',
        icon: '🔘',
        description: 'CTA button with link',
        component: <ButtonNode />,
      },
      {
        label: 'Image',
        icon: '🖼️',
        description: 'External image / photo',
        component: <ImageNode />,
      },
      {
        label: 'Icon',
        icon: '⭐',
        description: 'Emoji / icon element',
        component: <IconNode />,
      },
    ],
  },
]

export const ComponentPanel = () => {
  const { connectors } = useEditor()

  return (
    <div className="flex flex-col gap-3 p-3">
      {componentGroups.map(({ group, items }) => (
        <div key={group}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
            {group}
          </p>
          <div className="flex flex-col gap-1">
            {items.map(({ label, icon, description, component }) => (
              <div
                key={label}
                ref={(ref) => { if (ref) connectors.create(ref, component) }}
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
