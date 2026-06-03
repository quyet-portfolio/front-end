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
import { ThemeColorControl } from '../shared/ThemeColorControl'
import Input from 'antd/es/input'
import Select from 'antd/es/select'

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

  const field = (label: string, key: keyof HeroSectionProps) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <Input
        size="small"
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
      <ThemeColorControl
        label="Background Color"
        value={props.bgColor}
        fallback="#0f172a"
        onChange={(v) => setProp((p: HeroSectionProps) => (p.bgColor = v))}
      />
      <ThemeColorControl
        label="Accent Color"
        value={props.accentColor}
        fallback="#6366F1"
        onChange={(v) => setProp((p: HeroSectionProps) => (p.accentColor = v))}
      />
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Layout</label>
        <Select
          size="small"
          className="w-full"
          value={props.layout ?? 'centered'}
          onChange={(v) => setProp((p: HeroSectionProps) => (p.layout = v as HeroSectionProps['layout']))}
          options={[
            { value: 'centered', label: 'Centered' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
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
    // bgColor / accentColor cố ý KHÔNG seed default → follow Global Theme.
    // User set qua Settings = override; "↺ Theme" clear về undefined = follow.
    layout: 'centered',
  },
  related: { settings: HeroSettings },
}
