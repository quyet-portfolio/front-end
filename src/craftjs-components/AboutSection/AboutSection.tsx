/**
 * AboutSection — Giới thiệu bản thân với bio và highlights.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface AboutSectionProps {
  bio?: string
  highlights?: string[]
  bgColor?: string
}

import { AboutSectionUI } from './AboutSectionUI'
import { ThemeColorControl } from '../shared/ThemeColorControl'
import Input from 'antd/es/input'

export const AboutSection = (props: AboutSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <AboutSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const AboutSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as AboutSectionProps,
  }))

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Bio</label>
        <Input.TextArea
          rows={4}
          value={props.bio ?? ''}
          onChange={(e) => setProp((p: AboutSectionProps) => (p.bio = e.target.value))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Highlights <span className="text-slate-600">(one per line)</span>
        </label>
        <Input.TextArea
          rows={4}
          value={(props.highlights ?? []).join('\n')}
          onChange={(e) =>
            setProp(
              (p: AboutSectionProps) =>
                (p.highlights = e.target.value.split('\n').filter(Boolean))
            )
          }
        />
      </div>
      <ThemeColorControl
        label="Background"
        value={props.bgColor}
        fallback="#1e293b"
        onChange={(v) => setProp((p: AboutSectionProps) => (p.bgColor = v))}
      />
    </div>
  )
}

AboutSection.craft = {
  displayName: 'About Section',
  props: {
    bio: 'Write something about yourself here.',
    highlights: ['3+ years experience', 'Open source contributor'],
    // bgColor KHÔNG seed → follow Global Theme (override qua Settings).
  },
  related: { settings: AboutSettings },
}
