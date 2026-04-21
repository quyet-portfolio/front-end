/**
 * HeroSection — Section giới thiệu đầu trang.
 * Props có thể chỉnh qua Settings panel.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface HeroSectionProps {
  name?: string
  title?: string
  subtitle?: string
  bgColor?: string
  accentColor?: string
  layout?: 'centered' | 'left' | 'right'
}

import { HeroSectionUI } from './HeroSectionUI'

export const HeroSection = (props: HeroSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <HeroSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const HeroSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as HeroSectionProps,
  }))

  const field = (label: string, key: keyof HeroSectionProps, type = 'text') => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
        value={(props[key] as string) ?? ''}
        onChange={(e) =>
          setProp((p: HeroSectionProps) => ((p[key] as string) = e.target.value))
        }
      />
    </div>
  )

  return (
    <div className="space-y-3 p-4">
      {field('Name', 'name')}
      {field('Title / Role', 'title')}
      {field('Subtitle', 'subtitle')}
      {field('Background Color', 'bgColor', 'color')}
      {field('Accent Color', 'accentColor', 'color')}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Layout</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
          value={props.layout ?? 'centered'}
          onChange={(e) =>
            setProp(
              (p: HeroSectionProps) =>
                (p.layout = e.target.value as HeroSectionProps['layout'])
            )
          }
        >
          <option value="centered">Centered</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  )
}

HeroSection.craft = {
  displayName: 'Hero Section',
  props: {
    name: 'Your Name',
    title: 'Full-Stack Developer',
    subtitle: 'Building elegant solutions to complex problems.',
    bgColor: '#0f172a',
    accentColor: '#6366F1',
    layout: 'centered',
  },
  related: { settings: HeroSettings },
}
