'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { blogApi } from '@/src/lib/api/blog'
import { stripHtml } from '@/src/utils/stringUtils'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'

type HeadingPost = {
  id: string
  title: string
  desc: string
  author: string
  slug: string
  image: string
}

export const FALLBACK_IMAGE_BLOG = 'https://cdn.shopify.com/s/files/1/0734/4986/5316/files/default-image-blogs.png?v=1785683364'

export default function BlogHeading() {
  const [posts, setPosts] = useState<HeadingPost[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    blogApi
      .getFeaturedBlogs()
      .then((data) => {
        const mapped: HeadingPost[] = data.blogs.map((blog) => ({
          id: blog._id,
          title: blog.title,
          desc: stripHtml(recoverEscapedHtml(blog.excerpt || blog.content)),
          author: blog.author?.username || 'Unknown',
          slug: blog.slug,
          image: blog.featuredImage || FALLBACK_IMAGE_BLOG,
        }))
        setPosts(mapped)
        setActiveIndex(0)
      })
      .catch(() => setPosts([]))
  }, [])

  if (posts.length === 0) return null

  const count = posts.length
  const prevIndex = (activeIndex - 1 + count) % count
  const nextIndex = (activeIndex + 1) % count

  const showRight = count >= 2
  const showLeft = count >= 3

  const handlePrev = () => setActiveIndex(prevIndex)
  const handleNext = () => setActiveIndex(nextIndex)

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-6 sm:py-10">
      <div className="flex items-end justify-center w-[90%] relative h-[300px] sm:h-[400px]">
        {/* Left Card */}
        {showLeft && (
          <motion.div
            key={posts[prevIndex].id}
            onClick={handlePrev}
            initial={{ x: '-36%', opacity: 0 }}
            animate={{ x: '-26%', opacity: 1, scale: 0.8 }}
            exit={{ x: '-36%', opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="absolute left-0 w-1/3 h-[230px] sm:h-[350px] cursor-pointer rounded-xl overflow-hidden shadow-lg z-10 opacity-60 sm:opacity-70"
          >
            <Card post={posts[prevIndex]} small />
          </motion.div>
        )}

        {/* Right Card */}
        {showRight && (
          <motion.div
            key={posts[nextIndex].id}
            onClick={handleNext}
            initial={{ x: '36%', opacity: 0 }}
            animate={{ x: '26%', opacity: 1, scale: 0.8 }}
            exit={{ x: '36%', opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="absolute right-0 w-1/3 h-[230px] sm:h-[350px] cursor-pointer rounded-xl overflow-hidden shadow-lg z-10 opacity-60 sm:opacity-100"
          >
            <Card post={posts[nextIndex]} small textAlign="right" />
          </motion.div>
        )}

        {/* Center Card — rendered last so it sits above both side cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={posts[activeIndex].id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="absolute w-[75%] sm:w-[60%] h-[280px] sm:h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer z-20"
          >
            <Card post={posts[activeIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Card({
  post,
  small,
  textAlign,
}: {
  post: HeadingPost
  small?: boolean
  textAlign?: 'left' | 'center' | 'right'
}) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={post.image}
        alt={post.title}
        fill
        className="absolute inset-0 w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={true}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div
        className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-white ${
          small ? 'hidden sm:block' : ''
        } ${textAlign === 'right' ? 'text-right left-3 sm:left-4' : 'left-3 sm:left-4'}`}
      >
        <Link
          href={`/blogs/${post.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="hover:underline"
        >
          <h2 className={`font-bold line-clamp-2 ${small ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'}`}>
            {post.title}
          </h2>
        </Link>
        {!small && <p className="text-xs sm:text-sm mt-1 line-clamp-2">{post.desc}</p>}
        <p className="text-[10px] sm:text-xs mt-1.5 sm:mt-2 opacity-80">By {post.author}</p>
      </div>
    </div>
  )
}
