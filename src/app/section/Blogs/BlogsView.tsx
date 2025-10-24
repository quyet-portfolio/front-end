import Image from 'next/image'
import Navbar from '../../components/Layout/Navbar'
import { dataBlogs } from '../../data/blogs'
import { navItems } from '../../data/helper'
import BlogHeading from './BlogsHeading'

const BlogsView = () => {
  return (
    <div>
      <Navbar navItems={navItems} />
      <div className="relative my-16 z-10 flex flex-col items-center justify-center gap-4">
        <BlogHeading />
        <div className="grid grid-cols-3 gap-4">
          {dataBlogs.map((blog) => (
            <div
              key={blog.id}
              className="rounded-sm border-2 border-blue-950 bg-black-100 hover: overflow-hidden shadow-lg m-4"
            >
              <Image className="w-full h-48 object-cover" width={360} height={192} src={blog.image} alt={blog.title} />
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
    </div>
  )
}

export default BlogsView
