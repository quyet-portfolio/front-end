'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const posts = [
  {
    id: 1,
    title: 'Khám phá React 18',
    desc: 'Những tính năng mới trong React 18 giúp tối ưu hiệu suất.',
    author: 'Nguyễn Văn A',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
  },
  {
    id: 2,
    title: 'TailwindCSS cho developer',
    desc: 'Cách áp dụng Tailwind để xây dựng UI nhanh chóng.',
    author: 'Trần Thị B',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
  },
  {
    id: 3,
    title: 'Framer Motion Animation',
    desc: 'Tạo animation siêu mượt trong React.',
    author: 'Lê Văn C',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200',
  },
]

export default function BlogHeading() {
  const [activeIndex, setActiveIndex] = useState(0)

  const prevIndex = (activeIndex - 1 + posts.length) % posts.length
  const nextIndex = (activeIndex + 1) % posts.length

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prevIndex)
    }
  }
  
  const handleNext = () => setActiveIndex(nextIndex)

  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden py-10">
      <div className="flex items-end justify-center w-full max-w-6xl relative h-[400px]">
        {/* Left Card */}
        <motion.div
          key={posts[prevIndex].id}
          onClick={handlePrev}
          initial={{ x: '-36%', opacity: 0 }}
          animate={{ x: '-26%', opacity: 1, scale: 0.8 }}
          exit={{ x: '-36%', opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="absolute left-0 w-1/3 h-[350px] cursor-pointer rounded-xl overflow-hidden shadow-lg z-20 opacity-70"
        >
          <Card post={posts[prevIndex]} small />
        </motion.div>

        {/* Center Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={posts[activeIndex].id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="absolute w-[60%] h-[400px] rounded-2xl overflow-hidden shadow-xl cursor-pointer z-20"
          >
            <Card post={posts[activeIndex]} />
          </motion.div>
        </AnimatePresence>

        {/* Right Card */}
        <motion.div
          key={posts[nextIndex].id}
          onClick={handleNext}
          initial={{ x: '36%', opacity: 0 }}
          animate={{ x: '26%', opacity: 1, scale: 0.8 }}
          exit={{ x: '36%', opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
          className="absolute right-0 w-1/3 h-[350px] cursor-pointer rounded-xl overflow-hidden shadow-lg z-10"
        >
          <Card post={posts[nextIndex]} small textAlign="right" />
        </motion.div>
      </div>
    </div>
  )
}

function Card({
  post,
  small,
  textAlign,
}: {
  post: (typeof posts)[0]
  small?: boolean
  textAlign?: 'left' | 'center' | 'right'
}) {
  return (
    <div className="relative w-full h-full">
      <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
      {/* <Image
        src={post.image}
        alt={post.title}
        fill
        className="absolute inset-0 w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
        priority
      /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className={`absolute bottom-4 right-4 text-white ${textAlign === 'right' ? 'text-right' : 'left-4'}`}>
        <h2 className={`font-bold ${small ? 'text-lg' : 'text-2xl'}`}>{post.title}</h2>
        {!small && <p className="text-sm mt-1">{post.desc}</p>}
        <p className="text-xs mt-2 opacity-80">By {post.author}</p>
      </div>
    </div>
  )
}
