/**
 * ExperienceSection — Timeline kinh nghiệm làm việc.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface Job {
  company: string
  role: string
  period: string
  description: string
}

export interface ExperienceSectionProps {
  jobs?: Job[]
  bgColor?: string
  accentColor?: string
}

import { ExperienceSectionUI } from './ExperienceSectionUI'
import { ThemeColorControl } from '../shared/ThemeColorControl'
import Input from 'antd/es/input'
import Button from 'antd/es/button'

export const ExperienceSection = (props: ExperienceSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <ExperienceSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ExperienceSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ExperienceSectionProps,
  }))

  const jobs = props.jobs ?? []

  const updateJob = (index: number, field: keyof Job, value: string) => {
    setProp((p: ExperienceSectionProps) => {
      const updated = [...(p.jobs ?? [])]
      updated[index] = { ...updated[index], [field]: value }
      p.jobs = updated
    })
  }

  const addJob = () => {
    setProp((p: ExperienceSectionProps) => {
      p.jobs = [...(p.jobs ?? []), { company: 'Company', role: 'Role', period: '2024 – Present', description: 'Describe your role.' }]
    })
  }

  const removeJob = (index: number) => {
    setProp((p: ExperienceSectionProps) => {
      p.jobs = (p.jobs ?? []).filter((_, i) => i !== index)
    })
  }

  const jobFields: (keyof Job)[] = ['company', 'role', 'period', 'description']

  return (
    <div className="space-y-3 p-4">
      <ThemeColorControl
        label="Accent Color"
        value={props.accentColor}
        fallback="#6366F1"
        onChange={(v) => setProp((p: ExperienceSectionProps) => (p.accentColor = v))}
      />
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-400">Jobs</label>
        {jobs.map((job, i) => (
          <div key={i} className="bg-slate-800 rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Job {i + 1}</span>
              <Button size="small" type="text" danger onClick={() => removeJob(i)}>✕</Button>
            </div>
            {jobFields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-500 mb-0.5 capitalize">{field}</label>
                {field === 'description' ? (
                  <Input.TextArea
                    rows={2}
                    value={job[field]}
                    onChange={(e) => updateJob(i, field, e.target.value)}
                  />
                ) : (
                  <Input
                    size="small"
                    value={job[field]}
                    onChange={(e) => updateJob(i, field, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <Button size="small" type="dashed" block onClick={addJob}>
          + Add Job
        </Button>
      </div>
    </div>
  )
}

ExperienceSection.craft = {
  displayName: 'Experience Section',
  props: {
    jobs: [
      { company: 'Tech Company', role: 'Frontend Developer', period: '2022 – Present', description: 'Built and maintained scalable web applications.' },
    ],
    // bgColor / accentColor KHÔNG seed → follow Global Theme.
  },
  related: { settings: ExperienceSettings },
}
