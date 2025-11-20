'use client'

import AboutMe from '../components/AboutMe'
import Hero from '../components/Hero'
import Navbar from '../components/Layout/Navbar'
import RecentProjects from '../components/RecentProjects'
import WorkExperience from '../components/WorkExperience'
import { navItems } from '../data/helper'

export default function Home() {
  return (
    <div>
      {/* <Snowfall /> */}
      <div>
        <Navbar navItems={navItems} />
        {/* <div className="order-1 lg:order-2 flex justify-center relative reveal">
          <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent to-purple-500 rounded-[2rem] rotate-6 opacity-20 blur-lg"></div>
            <div className="absolute inset-0 bg-dark-800 rounded-[2rem] border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden group">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <div className="p-8 text-sm font-mono text-slate-400 opacity-80">
                <p>
                  <span className="text-purple-400">const</span> developer = {'{}'}
                </p>
                <p className="pl-4">
                  name: <span className="text-accent">&apos;Quyet&apos;</span>,
                </p>
                <p className="pl-4">
                  age: <span className="text-orange-400">25</span>,
                </p>
                <p className="pl-4">
                  skills: [<span className="text-accent">&apos;React&apos;</span>, <span className="text-accent">&apos;Next&apos;</span>],
                </p>
                <p className="pl-4">
                  hardWorker: <span className="text-blue-400">true</span>
                </p>
                <p>{'}'};</p>
                <br />
                <p>
                  <span className="text-slate-500">{'// Ready to build great things'}</span>
                </p>
                <p>
                  <span className="text-purple-400">developer</span>.<span className="text-blue-400">code</span>();
                </p>
              </div>

              <div
                className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine"
                style={{ left: '-100%', transition: 'left 0.5s' }}
              ></div>
            </div>
          </div>
        </div> */}
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
