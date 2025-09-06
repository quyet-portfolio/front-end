'use client'
import { navItems } from '@/src/app/data/helper'
import AboutMe from './components/AboutMe'
import Hero from './components/Hero'
import Footer from './components/Layout/Footer'
import Navbar from './components/Layout/Navbar'
import RecentProjects from './components/RecentProjects'
import WorkExperience from './components/WorkExperience'
import Snowfall from './components/SnowFall'

export default function Home() {

  return (
    <div className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <Snowfall />
      <div className="max-w-7xl w-full">
        <Navbar navItems={navItems} />
        <Hero />
        <AboutMe />
        <RecentProjects />
        <WorkExperience />
        {/* <Education /> */}
        {/* <Certifications /> */}
        {/* <Hobbies /> */}
        {/* <ContactMe /> */}
        <Footer />
      </div>
    </div>
  )
}
