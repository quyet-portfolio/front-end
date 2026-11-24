import React from 'react'
import type { AboutSectionProps } from './AboutSection'
import { tint } from '../shared/color'

const PRIMARY = 'var(--portfolio-primary, #6366F1)'

export const AboutSectionUI = ({
  bio = 'Write something about yourself here.',
  highlights = ['3+ years experience', 'Open source contributor'],
  bgColor = 'var(--portfolio-bg, #1e293b)',
}: AboutSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-pf-text mb-6 border-l-4 pl-4" style={{ borderColor: PRIMARY }}>
          About Me
        </h2>
        <p className="text-pf-muted text-lg leading-relaxed mb-8">{bio}</p>
        <div className="flex flex-wrap gap-3">
          {highlights.map((h, i) => (
            <span
              key={i}
              className="text-sm font-medium px-4 py-1.5 rounded-full border"
              style={{ background: tint(PRIMARY, 15), color: PRIMARY, borderColor: tint(PRIMARY, 35) }}
            >
              ✓ {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
