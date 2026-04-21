/**
 * ProjectsSection — Showcase projects dạng card grid.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface Project {
  title: string
  description: string
  image?: string
  link?: string
  tags?: string[]
}

export interface ProjectsSectionProps {
  projects?: Project[]
  bgColor?: string
  accentColor?: string
}

import { ProjectsSectionUI } from './ProjectsSectionUI'

export const ProjectsSection = (props: ProjectsSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <ProjectsSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ProjectsSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProjectsSectionProps,
  }))

  const projects = props.projects ?? []

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setProp((p: ProjectsSectionProps) => {
      const updated = [...(p.projects ?? [])]
      if (field === 'tags') {
        updated[index] = { ...updated[index], tags: value.split(',').map((t) => t.trim()).filter(Boolean) }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      p.projects = updated
    })
  }

  const addProject = () => {
    setProp((p: ProjectsSectionProps) => {
      p.projects = [...(p.projects ?? []), { title: 'New Project', description: 'Description', link: '', tags: [] }]
    })
  }

  const removeProject = (index: number) => {
    setProp((p: ProjectsSectionProps) => {
      p.projects = (p.projects ?? []).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Accent Color</label>
        <input
          type="color"
          value={props.accentColor ?? '#6366F1'}
          onChange={(e) => setProp((p: ProjectsSectionProps) => (p.accentColor = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-400">Projects</label>
        {projects.map((project, i) => (
          <div key={i} className="bg-slate-800 rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Project {i + 1}</span>
              <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-300 text-xs">✕ Remove</button>
            </div>
            {(['title', 'description', 'link', 'image'] as (keyof Project)[]).map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-500 mb-0.5 capitalize">{field}</label>
                <input
                  type="text"
                  value={(project[field] as string) ?? ''}
                  onChange={(e) => updateProject(i, field, e.target.value)}
                  className="w-full bg-slate-700 rounded px-2 py-1 text-xs text-white"
                  placeholder={field === 'link' ? 'https://...' : ''}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs text-slate-500 mb-0.5">Tags (comma separated)</label>
              <input
                type="text"
                value={(project.tags ?? []).join(', ')}
                onChange={(e) => updateProject(i, 'tags', e.target.value)}
                className="w-full bg-slate-700 rounded px-2 py-1 text-xs text-white"
                placeholder="React, TypeScript, ..."
              />
            </div>
          </div>
        ))}
        <button
          onClick={addProject}
          className="w-full border border-dashed border-slate-600 rounded py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
        >
          + Add Project
        </button>
      </div>
    </div>
  )
}

ProjectsSection.craft = {
  displayName: 'Projects Section',
  props: {
    projects: [
      { title: 'Project Alpha', description: 'A SaaS dashboard with real-time analytics.', link: 'https://github.com', tags: ['Next.js', 'TypeScript'] },
    ],
    bgColor: '#0f172a',
    accentColor: '#6366F1',
  },
  related: { settings: ProjectsSettings },
}
