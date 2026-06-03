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
import { ThemeColorControl } from '../shared/ThemeColorControl'
import Input from 'antd/es/input'
import Slider from 'antd/es/slider'
import Button from 'antd/es/button'

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
      <ThemeColorControl
        label="Accent Color"
        value={props.accentColor}
        fallback="#6366F1"
        onChange={(v) => setProp((p: SkillsSectionProps) => (p.accentColor = v))}
      />
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400">Skills</label>
        {skills.map((skill, i) => (
          <div key={i} className="bg-slate-800 rounded p-2 space-y-1">
            <Input
              size="small"
              value={skill.name}
              onChange={(e) => updateSkill(i, 'name', e.target.value)}
              placeholder="Skill name"
            />
            <div className="flex items-center gap-2">
              <Slider
                className="flex-1"
                min={0}
                max={100}
                value={skill.level}
                onChange={(v) => updateSkill(i, 'level', v)}
              />
              <span className="text-xs text-slate-400 w-8 text-right">{skill.level}%</span>
              <Button size="small" type="text" danger onClick={() => removeSkill(i)}>
                ✕
              </Button>
            </div>
          </div>
        ))}
        <Button size="small" type="dashed" block onClick={addSkill}>
          + Add Skill
        </Button>
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
    // bgColor / accentColor KHÔNG seed → follow Global Theme.
  },
  related: { settings: SkillsSettings },
}
