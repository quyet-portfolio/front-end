import React from 'react'
import type { ExperienceSectionProps } from './ExperienceSection'

export const ExperienceSectionUI = ({
  jobs = [
    {
      company: 'Tech Company',
      role: 'Frontend Developer',
      period: '2022 – Present',
      description: 'Built and maintained scalable web applications.',
    },
  ],
  bgColor = '#1e293b',
  accentColor = '#6366F1',
}: ExperienceSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 pl-4" style={{ borderColor: accentColor }}>
          Experience
        </h2>
        <div className="relative border-l-2 border-slate-700 ml-4 space-y-8">
          {jobs.map((job, i) => (
            <div key={i} className="relative pl-8">
              {/* Timeline dot */}
              <div
                className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-800"
                style={{ background: accentColor }}
              />
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs font-semibold text-slate-400 mb-1">{job.period}</p>
                <h3 className="font-bold text-white">{job.role}</h3>
                <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
                  {job.company}
                </p>
                <p className="text-sm text-slate-400">{job.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
