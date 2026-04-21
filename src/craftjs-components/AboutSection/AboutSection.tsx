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
        <textarea
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white resize-none"
          value={props.bio ?? ''}
          onChange={(e) =>
            setProp((p: AboutSectionProps) => (p.bio = e.target.value))
          }
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">
          Highlights <span className="text-slate-600">(one per line)</span>
        </label>
        <textarea
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white resize-none"
          value={(props.highlights ?? []).join('\n')}
          onChange={(e) =>
            setProp(
              (p: AboutSectionProps) =>
                (p.highlights = e.target.value.split('\n').filter(Boolean))
            )
          }
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Background</label>
        <input
          type="color"
          value={props.bgColor ?? '#1e293b'}
          onChange={(e) =>
            setProp((p: AboutSectionProps) => (p.bgColor = e.target.value))
          }
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
    </div>
  )
}

AboutSection.craft = {
  displayName: 'About Section',
  props: {
    bio: 'Write something about yourself here.',
    highlights: ['3+ years experience', 'Open source contributor'],
    bgColor: '#1e293b',
  },
  related: { settings: AboutSettings },
}
