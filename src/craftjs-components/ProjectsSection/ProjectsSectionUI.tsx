import React from 'react'
import type { ProjectsSectionProps } from './ProjectsSection'
import { tint } from '../shared/color'
import { safeUrl } from '../shared/url'

export const ProjectsSectionUI = ({
  projects = [
    {
      title: 'Project Alpha',
      description: 'A SaaS dashboard with real-time analytics.',
      link: 'https://github.com',
      tags: ['Next.js', 'TypeScript'],
    },
  ],
  bgColor = 'var(--portfolio-bg, #0f172a)',
  accentColor = 'var(--portfolio-primary, #6366F1)',
}: ProjectsSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-pf-text mb-8 border-l-4 pl-4" style={{ borderColor: accentColor }}>
          Projects
        </h2>
        <div className="grid grid-cols-1 pf-sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="rounded-xl border border-pf-border bg-pf-surface overflow-hidden hover:border-pf-primary transition-all duration-200 hover:shadow-lg"
            >
              {safeUrl(project.image) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={safeUrl(project.image)} alt={project.title} className="w-full h-40 object-cover" />
              )}
              {!safeUrl(project.image) && (
                <div
                  className="w-full h-40 flex items-center justify-center text-4xl font-bold"
                  style={{ background: tint(accentColor, 12), color: accentColor }}
                >
                  {project.title.charAt(0)}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-pf-text mb-1">{project.title}</h3>
                <p className="text-sm text-pf-muted mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(project.tags ?? []).map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: tint(accentColor, 12), color: accentColor }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {safeUrl(project.link) && (
                  <a
                    href={safeUrl(project.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: accentColor }}
                  >
                    View Project →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
