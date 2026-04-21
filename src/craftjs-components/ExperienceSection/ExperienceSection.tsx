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
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Accent Color</label>
        <input
          type="color"
          value={props.accentColor ?? '#6366F1'}
          onChange={(e) => setProp((p: ExperienceSectionProps) => (p.accentColor = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-400">Jobs</label>
        {jobs.map((job, i) => (
          <div key={i} className="bg-slate-800 rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Job {i + 1}</span>
              <button onClick={() => removeJob(i)} className="text-red-400 hover:text-red-300 text-xs">✕</button>
            </div>
            {jobFields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-slate-500 mb-0.5 capitalize">{field}</label>
                {field === 'description' ? (
                  <textarea
                    rows={2}
                    value={job[field]}
                    onChange={(e) => updateJob(i, field, e.target.value)}
                    className="w-full bg-slate-700 rounded px-2 py-1 text-xs text-white resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={job[field]}
                    onChange={(e) => updateJob(i, field, e.target.value)}
                    className="w-full bg-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={addJob}
          className="w-full border border-dashed border-slate-600 rounded py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
        >
          + Add Job
        </button>
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
    bgColor: '#1e293b',
    accentColor: '#6366F1',
  },
  related: { settings: ExperienceSettings },
}
