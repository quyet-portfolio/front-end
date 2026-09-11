import { FaLocationArrow } from 'react-icons/fa6'
import type { ReactNode } from 'react'
import ComingSoonBadge from './ComingSoonBadge'
import ProjectLink from './ProjectLink'

type TProjectCard = {
  name: string
  description: string
  href?: string
  external: boolean
  location?: string
  cta?: string
  preview: ReactNode
}

const ProjectCard = ({ name, description, href, external, location, cta, preview }: TProjectCard) => {
  const body = (
    <>
      <div className="mb-6 h-[220px] overflow-hidden rounded-lg border border-white/[0.06] bg-[rgb(4,7,29)]">
        {preview}
      </div>
      <h3 className="text-base font-bold md:text-xl">{name}</h3>
      <p className="my-[1vh] text-sm font-light text-white-100 md:text-base">{description}</p>
      <div className="mt-auto flex min-h-11 items-center justify-between gap-3 pt-5">
        {location ? (
          <span className="truncate rounded-full bg-[#10132E] px-2.5 py-1 text-xs text-white-200">{location}</span>
        ) : (
          <span />
        )}
        {href ? (
          <span className="flex shrink-0 items-center gap-2.5 rounded-full p-2 text-sm text-purple transition duration-500 group-hover:bg-purple/20">
            {cta}
            <FaLocationArrow aria-hidden />
          </span>
        ) : (
          <ComingSoonBadge />
        )}
      </div>
    </>
  )

  // Chưa ra mắt thì không phải link; viền đứt để đọc được ngay là "chưa sẵn sàng".
  if (!href) {
    return <div className="flex w-full flex-col rounded-2xl border border-dashed border-white/[0.16] p-4">{body}</div>
  }

  return (
    <ProjectLink
      href={href}
      external={external}
      className="group flex w-full flex-col rounded-2xl border border-white/[0.1] p-4 transition duration-500 hover:border-white/[0.3] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100"
    >
      {body}
    </ProjectLink>
  )
}

export default ProjectCard
