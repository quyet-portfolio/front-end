/**
 * HeroSectionUI — Pure UI component, không phụ thuộc @craftjs/core.
 * Dùng trong CraftRenderer (public page SSR).
 */
import React from 'react'
import type { HeroSectionProps } from './HeroSection'

export const HeroSectionUI = ({
  name = 'Your Name',
  title = 'Full-Stack Developer',
  subtitle = 'Building elegant solutions to complex problems.',
  bgColor = '#0f172a',
  accentColor = '#6366F1',
  layout = 'centered',
}: HeroSectionProps) => {
  const alignClass =
    layout === 'centered'
      ? 'items-center text-center'
      : layout === 'left'
      ? 'items-start text-left'
      : 'items-end text-right'

  return (
    <section
      style={{ background: bgColor }}
      className={`w-full py-24 px-8 flex flex-col gap-4 ${alignClass}`}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
        style={{ background: accentColor }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">{name}</h1>
      <p className="text-xl font-semibold" style={{ color: accentColor }}>{title}</p>
      <p className="text-lg text-slate-400 max-w-xl">{subtitle}</p>
    </section>
  )
}
