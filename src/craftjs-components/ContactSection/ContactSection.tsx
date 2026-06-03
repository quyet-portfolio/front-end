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
import { ThemeColorControl } from '../shared/ThemeColorControl'
import Input from 'antd/es/input'
import Button from 'antd/es/button'

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
        <Input
          size="small"
          type="email"
          value={props.email ?? ''}
          onChange={(e) => setProp((p: ContactSectionProps) => (p.email = e.target.value))}
        />
      </div>
      <ThemeColorControl
        label="Accent Color"
        value={props.accentColor}
        fallback="#6366F1"
        onChange={(v) => setProp((p: ContactSectionProps) => (p.accentColor = v))}
      />
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400">Social Links</label>
        {socials.map((s, i) => (
          <div key={i} className="bg-slate-800 rounded p-2 space-y-1">
            <div className="flex gap-1">
              <Input
                size="small"
                className="w-1/3"
                value={s.platform}
                onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                placeholder="Platform"
              />
              <Input
                size="small"
                className="flex-1"
                value={s.url}
                onChange={(e) => updateSocial(i, 'url', e.target.value)}
                placeholder="https://..."
              />
              <Button size="small" type="text" danger onClick={() => removeSocial(i)}>
                ✕
              </Button>
            </div>
          </div>
        ))}
        <Button size="small" type="dashed" block onClick={addSocial}>
          + Add Social
        </Button>
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
    // bgColor / accentColor KHÔNG seed → follow Global Theme.
  },
  related: { settings: ContactSettings },
}
