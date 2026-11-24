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
  bgColor = 'var(--portfolio-bg, #0f172a)',
  accentColor = 'var(--portfolio-primary, #6366F1)',
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
      className="w-full py-16 pf-md:py-24 px-6 pf-md:px-8"
    >
      <div className={`max-w-5xl mx-auto w-full flex flex-col gap-4 ${alignClass}`}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
          style={{ background: accentColor }}
        >
          {name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-4xl pf-md:text-6xl font-extrabold text-pf-text tracking-tight">{name}</h1>
        <p className="text-xl font-semibold" style={{ color: accentColor }}>{title}</p>
        <p className="text-lg text-pf-muted max-w-xl">{subtitle}</p>
      </div>
    </section>
  )
}
