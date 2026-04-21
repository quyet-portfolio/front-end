import React from 'react'
import type { AboutSectionProps } from './AboutSection'

export const AboutSectionUI = ({
  bio = 'Write something about yourself here.',
  highlights = ['3+ years experience', 'Open source contributor'],
  bgColor = '#1e293b',
}: AboutSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-indigo-500 pl-4">
          About Me
        </h2>
        <p className="text-slate-300 text-lg leading-relaxed mb-8">{bio}</p>
        <div className="flex flex-wrap gap-3">
          {highlights.map((h, i) => (
            <span
              key={i}
              className="bg-indigo-500/20 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full border border-indigo-500/30"
            >
              ✓ {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
