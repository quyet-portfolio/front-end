'use client'

import AboutMe from '@/src/app/section/home/about-me'
import Hero from '@/src/app/section/home/hero'
import Navbar from '@/src/layouts/navbar'
import RecentProjects from '@/src/app/section/home/recent-projects'
import WorkExperience from '@/src/app/section/home/work-experience'
import { navItems } from '../data/helper'

export default function Home() {
  return (
    <div>
      <div>
        <Navbar navItems={navItems} />
        <Hero />
        <AboutMe />
        <RecentProjects />
        <WorkExperience />
      </div>
    </div>
  )
}
