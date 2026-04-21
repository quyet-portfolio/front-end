import React from 'react'
import type { ProjectsSectionProps } from './ProjectsSection'

export const ProjectsSectionUI = ({
  projects = [
    {
      title: 'Project Alpha',
      description: 'A SaaS dashboard with real-time analytics.',
      link: 'https://github.com',
      tags: ['Next.js', 'TypeScript'],
    },
  ],
  bgColor = '#0f172a',
  accentColor = '#6366F1',
}: ProjectsSectionProps) => {
  return (
    <section
      style={{ background: bgColor }}
      className="w-full py-16 px-8"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 pl-4" style={{ borderColor: accentColor }}>
          Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden hover:border-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              {project.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
              )}
              {!project.image && (
                <div
                  className="w-full h-40 flex items-center justify-center text-4xl font-bold"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {project.title.charAt(0)}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-white mb-1">{project.title}</h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(project.tags ?? []).map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${accentColor}20`, color: accentColor }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
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
