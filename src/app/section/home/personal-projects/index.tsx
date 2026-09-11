import { LuBookOpen, LuLayers, LuLayoutTemplate, LuTrophy } from 'react-icons/lu'
import { personalProjects } from '@/src/app/data/helper'
import { BlogsPreview, BuilderPreview, NamDinhFcPreview, NotesPreview } from './previews'
import ProjectCard from './ProjectCard'
import ProjectCarousel from './ProjectCarousel'
import ProjectStripItem from './ProjectStripItem'

const PersonalProjects = () => {
  const visuals = {
    blogs: { icon: <LuBookOpen />, preview: <BlogsPreview /> },
    notes: { icon: <LuLayers />, preview: <NotesPreview /> },
    'namdinh-fc': { icon: <LuTrophy />, preview: <NamDinhFcPreview /> },
    'portfolio-builder': { icon: <LuLayoutTemplate />, preview: <BuilderPreview /> },
  }

  const items = personalProjects.map((project) => {
    const external = !!project.href && /^https?:\/\//.test(project.href)
    return {
      ...project,
      ...visuals[project.id as keyof typeof visuals],
      external,
      location: project.href ? (external ? new URL(project.href).host : 'On this site') : undefined,
    }
  })

  return (
    <section id="personal-projects" aria-labelledby="personal-projects-heading" className="scroll-mt-24 py-10 lg:py-20">
      <h2 id="personal-projects-heading" className="heading">
        <span className="text-purple">Personal Projects</span>
      </h2>
      <p className="mx-auto mt-4 max-w-[620px] text-center text-base text-white-100 md:text-lg">
        Products I build outside client work — some live right here, others run on their own domains.
      </p>
      {/* <ul className="relative z-10 mt-12 hidden grid-cols-4 divide-x divide-white/[0.08] rounded-2xl border border-black-300 bg-black-200 backdrop-blur-lg backdrop-saturate-150 lg:grid">
        {items.map((item, idx) => (
          <ProjectStripItem
            key={item.id}
            name={item.name}
            tagline={item.tagline}
            description={item.description}
            href={item.href}
            external={item.external}
            location={item.location}
            cta={item.cta}
            icon={item.icon}
            preview={item.preview}
            align={idx === 0 ? 'start' : idx === items.length - 1 ? 'end' : 'center'}
          />
        ))}
      </ul> */}

      <ProjectCarousel label="Personal projects">
        {items.map((item) => (
          <li key={item.id} className="flex w-[85%] max-w-[360px] shrink-0 snap-start sm:w-[360px]">
            <ProjectCard
              name={item.name}
              description={item.description}
              href={item.href}
              external={item.external}
              location={item.location}
              cta={item.cta}
              preview={item.preview}
            />
          </li>
        ))}
      </ProjectCarousel>
    </section>
  )
}

export default PersonalProjects
