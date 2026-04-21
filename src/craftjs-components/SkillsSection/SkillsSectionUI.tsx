import React from 'react'
import type { SkillsSectionProps } from './SkillsSection'

export const SkillsSectionUI = ({
  skills = [
    { name: 'TypeScript', level: 90 },
    { name: 'React / Next.js', level: 88 },
  ],
  bgColor = '#0f172a',
  accentColor = '#6366F1',
}: SkillsSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 pl-4" style={{ borderColor: accentColor }}>
          Skills
        </h2>
        <div className="space-y-4">
          {skills.map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-semibold text-white">{skill.name}</span>
                <span className="text-sm text-slate-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${skill.level}%`, background: accentColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
