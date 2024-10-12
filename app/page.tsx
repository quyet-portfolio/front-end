"use client";
import AboutMe from "./component/AboutMe";
import Hero from "./component/Hero";
import Navbar from "./component/Layout/Navbar";
import { navItems } from "@/data/helper";
import RecentProjects from "./component/RecentProjects";
import WorkExperience from "./component/WorkExperience";
import Footer from "./component/Layout/Footer";

export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <Navbar navItems={navItems}/>
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
  );
}
