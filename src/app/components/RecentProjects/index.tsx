'use client'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa6'
import Image from 'next/image'
import { projects } from '../../data/helper'

const RecentProjects = () => {
  return (
    <section id="projects">
      <div className="py-10 lg:py-20">
        <h1 className="heading">
          <span className="text-purple">Recent Projects</span>
        </h1>
        <div className="flex justify-between flex-wrap gap-10 mt-10">
          {projects.map((item) => (
            <div
              className="flex items-center justify-center w-full lg:w-[calc((100%-40px)/2)] p-4 rounded-2xl border border-white/[0.1] hover:border-white/[0.3] transition duration-500"
              key={item.id}
            >
              <div>
                <div className="overflow-hidden mb-6 rounded-lg">
                  <Image src={item.img} alt="cover" className='w-[100%] h-auto' width={400} height={300} />
                </div>
                <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">{item.title}</h1>
                <p
                  className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                  style={{
                    color: '#BEC1DD',
                    margin: '1vh 0',
                  }}
                >
                  {item.des}
                </p>

                <div className="flex items-center justify-between mt-7 mb-3">
                  <div className="flex items-center">
                    {item.iconLists.map((icon, index) => (
                      <div
                        key={index}
                        className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{
                          transform: `translateX(-${5 * index + 2}px)`,
                        }}
                      >
                        <img src={icon} alt="icon5" className="p-2" />
                      </div>
                    ))}
                  </div>

                  <div onClick={() => window.open(item.link)} className="flex justify-center items-center">
                    <p className="flex lg:text-xl md:text-xs text-xs text-purple">Check Live Site</p>
                    <FaLocationArrow className="ms-3" color="#CBACF9" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentProjects
