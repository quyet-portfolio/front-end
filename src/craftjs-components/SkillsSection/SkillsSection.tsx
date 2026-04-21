/**
 * SkillsSection — Tech stack & skill levels.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface Skill {
  name: string
  level: number // 0-100
}

export interface SkillsSectionProps {
  skills?: Skill[]
  bgColor?: string
  accentColor?: string
}

import { SkillsSectionUI } from './SkillsSectionUI'

export const SkillsSection = (props: SkillsSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <SkillsSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const SkillsSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as SkillsSectionProps,
  }))

  const skills = props.skills ?? []

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setProp((p: SkillsSectionProps) => {
      const updated = [...(p.skills ?? [])]
      updated[index] = { ...updated[index], [field]: value }
      p.skills = updated
    })
  }

  const addSkill = () => {
    setProp((p: SkillsSectionProps) => {
      p.skills = [...(p.skills ?? []), { name: 'New Skill', level: 70 }]
    })
  }

  const removeSkill = (index: number) => {
    setProp((p: SkillsSectionProps) => {
      p.skills = (p.skills ?? []).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Accent Color</label>
        <input
          type="color"
          value={props.accentColor ?? '#6366F1'}
          onChange={(e) => setProp((p: SkillsSectionProps) => (p.accentColor = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400">Skills</label>
        {skills.map((skill, i) => (
          <div key={i} className="bg-slate-800 rounded p-2 space-y-1">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(i, 'name', e.target.value)}
              className="w-full bg-slate-700 rounded px-2 py-1 text-xs text-white"
              placeholder="Skill name"
            />
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={100}
                value={skill.level}
                onChange={(e) => updateSkill(i, 'level', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-slate-400 w-8 text-right">{skill.level}%</span>
              <button
                onClick={() => removeSkill(i)}
                className="text-red-400 hover:text-red-300 text-xs"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addSkill}
          className="w-full border border-dashed border-slate-600 rounded py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
        >
          + Add Skill
        </button>
      </div>
    </div>
  )
}

SkillsSection.craft = {
  displayName: 'Skills Section',
  props: {
    skills: [
      { name: 'TypeScript', level: 90 },
      { name: 'React / Next.js', level: 88 },
    ],
    bgColor: '#0f172a',
    accentColor: '#6366F1',
  },
  related: { settings: SkillsSettings },
}
