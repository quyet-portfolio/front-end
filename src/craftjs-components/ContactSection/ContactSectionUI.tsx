import React from 'react'
import type { ContactSectionProps } from './ContactSection'

const PLATFORM_ICONS: Record<string, string> = {
  GitHub: '🐙',
  LinkedIn: '💼',
  Twitter: '🐦',
  Dribbble: '🎨',
  Behance: '🅱',
  YouTube: '▶',
  Website: '🌐',
}

export const ContactSectionUI = ({
  email = 'your@email.com',
  socials = [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
  ],
  bgColor = '#0f172a',
  accentColor = '#6366F1',
}: ContactSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-20 px-8 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
        <p className="text-slate-400 mb-8">
          Reach out via email or find me on the platforms below.
        </p>
        <a
          href={`mailto:${email}`}
          className="inline-block px-8 py-3 rounded-full font-semibold text-white mb-10 transition-all hover:opacity-90 hover:scale-105"
          style={{ background: accentColor }}
        >
          ✉ {email}
        </a>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 rounded-full border font-medium text-sm transition-all hover:scale-105"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              <span>{PLATFORM_ICONS[s.platform] ?? '🔗'}</span>
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
