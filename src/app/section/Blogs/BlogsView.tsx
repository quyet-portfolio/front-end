import React from 'react'
import Spotlight from '../../components/Layout/ui/Spotlight'
import { dataBlogs } from '../../data/blogs'
import Image from 'next/image'
import BlogHeading from './BlogsHeading'
import Navbar from '../../components/Layout/Navbar'
import { navItems } from '../../data/helper'
import Footer from '../../_layout/Footer'

const BlogsView = () => {
  return (
    <div className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div>
        <div>
          <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
          <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
          <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
        </div>

        <Navbar navItems={navItems} />
        <div className="relative my-16 z-10 flex flex-col items-center justify-center gap-4">
          <BlogHeading />
          <div className="grid grid-cols-3 gap-4">
            {dataBlogs.map((blog) => (
              <div
                key={blog.id}
                className="max-w-sm rounded-sm border-2 border-blue-950 bg-black-100 hover: overflow-hidden shadow-lg m-4"
              >
                <Image
                  className="w-full h-48 object-cover"
                  width={360}
                  height={192}
                  src={blog.image}
                  alt={blog.title}
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{blog.title}</div>
                  <p className="text-white-200 text-base"> {blog.description}</p>
                </div>
                <div className="px-6 pt-4 pb-2 flex justify-between">
                  <span className="text-xs font-semibold text-white-100">By: {blog.author}</span>
                  {/* <span className="text-sm font-semibold text-white-100">
                    Created: {new Date(blog.createAt).toLocaleDateString()}
                  </span> */}
                  {/* <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  Updated: {new Date(blog.updateAt).toLocaleDateString()}
                </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default BlogsView
