import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type TProjectLink = Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
  href: string
  external: boolean
}

// Project chạy ở domain riêng mở tab mới và báo trước cho screen reader; project nằm
// trên site này đi qua next/link để giữ điều hướng phía client và prefetch.
const ProjectLink = ({ href, external, children, ...props }: TProjectLink) => {
  if (!external) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export default ProjectLink
