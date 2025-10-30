'use client'

import AboutMe from '../components/AboutMe'
import Hero from '../components/Hero'
import Navbar from '../components/Layout/Navbar'
import RecentProjects from '../components/RecentProjects'
import WorkExperience from '../components/WorkExperience'
import { navItems } from '../data/helper'

export default function Home() {

  return (
    <div >
      {/* <Snowfall /> */}
      <div >
        <Navbar navItems={navItems} />
        <Hero />
        <AboutMe />
        <RecentProjects />
        <WorkExperience />
        {/* <Education /> */}
        {/* <Certifications /> */}
        {/* <Hobbies /> */}
        {/* <ContactMe /> */}
      </div>
    </div>
  )
}
