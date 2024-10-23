'use client'
import AboutMe from './pages/component/AboutMe'
import Hero from './pages/component/Hero'
import Navbar from './pages/component/Layout/Navbar'
import { navItems } from '@/data/helper'
import RecentProjects from './pages/component/RecentProjects'
import WorkExperience from './pages/component/WorkExperience'
import Footer from './pages/component/Layout/Footer'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
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
    </main>
  )
}
