import { LuBookOpen, LuLayers, LuLayoutTemplate } from 'react-icons/lu'
import { subProjects } from '@/src/app/data/helper'
import { BlogsPreview, BuilderPreview, NotesPreview } from './previews'
import SubProjectCard from './SubProjectCard'
import SubProjectStripItem from './SubProjectStripItem'

const SubProjects = () => {
  const visuals = {
    blogs: { icon: <LuBookOpen />, preview: <BlogsPreview /> },
    notes: { icon: <LuLayers />, preview: <NotesPreview /> },
    'portfolio-builder': { icon: <LuLayoutTemplate />, preview: <BuilderPreview /> },
  }

  const items = subProjects.map((project) => ({ ...project, ...visuals[project.id as keyof typeof visuals] }))

  return (
    <section id="sub-projects" aria-labelledby="sub-projects-heading" className="scroll-mt-24 py-10 lg:py-20">
      <h2 id="sub-projects-heading" className="heading">
        <span className="text-purple">Built into this site</span>
      </h2>
      <p className="mx-auto mt-4 max-w-[620px] text-center text-base text-white-100 md:text-lg">
        Products I designed and built end to end — two are live here today, the third is on the way.
      </p>

      {/* Desktop: dải launcher, preview bật lên khi hover/focus. Không overflow-hidden
          vì popover tràn ra ngoài dải; z-10 để popover nằm trên Recent Projects — các
          icon có transform ở đó tự tạo stacking context và sẽ vẽ đè nếu dải ở mức z 0. */}
      <ul className="relative z-10 mt-12 hidden grid-cols-3 divide-x divide-white/[0.08] rounded-2xl border border-black-300 bg-black-200 backdrop-blur-lg backdrop-saturate-150 lg:grid">
        {items.map((item) => (
          <SubProjectStripItem
            key={item.id}
            name={item.name}
            tagline={item.tagline}
            description={item.description}
            href={item.href}
            cta={item.cta}
            icon={item.icon}
            preview={item.preview}
          />
        ))}
      </ul>

      {/* Mobile/tablet không có hover, nên preview nằm sẵn trong từng thẻ. */}
      <ul className="mt-10 grid grid-cols-1 gap-10 lg:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex">
            <SubProjectCard
              name={item.name}
              description={item.description}
              href={item.href}
              cta={item.cta}
              preview={item.preview}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SubProjects
