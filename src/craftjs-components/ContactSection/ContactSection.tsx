/**
 * ContactSection — Contact info với email & social links.
 */
'use client'

import { useNode } from '@craftjs/core'

export interface SocialLink {
  platform: string
  url: string
}

export interface ContactSectionProps {
  email?: string
  socials?: SocialLink[]
  bgColor?: string
  accentColor?: string
}

import { ContactSectionUI } from './ContactSectionUI'

export const ContactSection = (props: ContactSectionProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((node) => ({
    isSelected: node.events.selected,
  }))

  return (
    <div
      ref={(ref: any) => { connect(drag(ref)) }}
      className={isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}
    >
      <ContactSectionUI {...props} />
    </div>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────

const ContactSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ContactSectionProps,
  }))

  const socials = props.socials ?? []

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
    setProp((p: ContactSectionProps) => {
      const updated = [...(p.socials ?? [])]
      updated[index] = { ...updated[index], [field]: value }
      p.socials = updated
    })
  }

  const addSocial = () => {
    setProp((p: ContactSectionProps) => {
      p.socials = [...(p.socials ?? []), { platform: 'GitHub', url: 'https://' }]
    })
  }

  const removeSocial = (index: number) => {
    setProp((p: ContactSectionProps) => {
      p.socials = (p.socials ?? []).filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-3 p-4">
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
        <input
          type="email"
          value={props.email ?? ''}
          onChange={(e) => setProp((p: ContactSectionProps) => (p.email = e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Accent Color</label>
        <input
          type="color"
          value={props.accentColor ?? '#6366F1'}
          onChange={(e) => setProp((p: ContactSectionProps) => (p.accentColor = e.target.value))}
          className="w-full h-9 rounded cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400">Social Links</label>
        {socials.map((s, i) => (
          <div key={i} className="bg-slate-800 rounded p-2 space-y-1">
            <div className="flex gap-1">
              <input
                type="text"
                value={s.platform}
                onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                className="w-1/3 bg-slate-700 rounded px-2 py-1 text-xs text-white"
                placeholder="Platform"
              />
              <input
                type="text"
                value={s.url}
                onChange={(e) => updateSocial(i, 'url', e.target.value)}
                className="flex-1 bg-slate-700 rounded px-2 py-1 text-xs text-white"
                placeholder="https://..."
              />
              <button onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-300 text-xs px-1">
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addSocial}
          className="w-full border border-dashed border-slate-600 rounded py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
        >
          + Add Social
        </button>
      </div>
    </div>
  )
}

ContactSection.craft = {
  displayName: 'Contact Section',
  props: {
    email: 'your@email.com',
    socials: [
      { platform: 'GitHub', url: 'https://github.com' },
      { platform: 'LinkedIn', url: 'https://linkedin.com' },
    ],
    bgColor: '#0f172a',
    accentColor: '#6366F1',
  },
  related: { settings: ContactSettings },
}
