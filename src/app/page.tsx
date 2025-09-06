'use client'
import { navItems } from '@/src/app/data/helper'
import AboutMe from './pages/component/AboutMe'
import Hero from './pages/component/Hero'
import Footer from './pages/component/Layout/Footer'
import Navbar from './pages/component/Layout/Navbar'
import RecentProjects from './pages/component/RecentProjects'
import WorkExperience from './pages/component/WorkExperience'
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
