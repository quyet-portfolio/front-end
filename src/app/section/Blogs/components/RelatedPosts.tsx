import Image from 'next/image'
import Link from 'next/link'
import { BlogListItem } from '@/src/lib/types'
import { stripHtml } from '@/src/utils/stringUtils'
import { recoverEscapedHtml } from '@/src/utils/htmlContent'
import { FALLBACK_IMAGE_BLOG } from '../BlogsHeading'

/**
 * Server component — KHÔNG chuyển sang client.
 *
 * Toàn bộ giá trị của block này nằm ở chỗ nó tạo link nội bộ giữa các bài; link
 * chỉ xuất hiện sau khi JS chạy thì crawler không thấy gì và công sức thành số 0.
 */
const RelatedPosts = ({ blogs }: { blogs: BlogListItem[] }) => {
  if (!blogs.length) return null

  return (
    <section className="container mx-auto px-4 sm:px-4 max-w-4xl mt-12" aria-labelledby="related-posts-heading">
      <h2 id="related-posts-heading" className="text-2xl font-bold text-white mb-6">
        Bài viết liên quan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            href={`/blogs/${blog.slug}`}
            className="group flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-[#0d1433] to-[#0a0f24]
              border border-white/5 hover:border-indigo-500/60 shadow-sm hover:shadow-indigo-900/30 hover:shadow-lg
              transition-all duration-300"
          >
            <div className="relative w-full h-32 flex-shrink-0">
              <Image
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
                src={blog.featuredImage || FALLBACK_IMAGE_BLOG}
                alt={blog.title}
              />
              {blog.category && (
                <span className="absolute top-2 left-2 bg-[#6366F1] text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full">
                  {blog.category}
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1 px-4 py-3 gap-1.5">
              <h3 className="font-bold text-sm text-white leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                {blog.title}
              </h3>
              <p className="text-white-200 text-xs leading-relaxed line-clamp-2">
                {stripHtml(recoverEscapedHtml(blog.excerpt || ''))}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
