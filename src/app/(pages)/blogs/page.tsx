import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import BlogsView from '../../section/Blogs/BlogsView'
import { buildHref, buildParams, parseBlogListState } from '../../section/Blogs/utils/listParams'
import { getBlogCategories, getBlogsForList, getFeaturedBlogs } from '@/src/lib/api/blogServer'
import { BLOG_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'

const BLOGS_DESCRIPTION =
  'Bài viết về lập trình web, hiệu năng Next.js, kiến trúc hệ thống — cùng những ghi chép về sức khoẻ và tâm lý.'

type BlogsSearchParams = { page?: string; category?: string; search?: string }

type BlogsPageProps = {
  searchParams: Promise<BlogsSearchParams>
}

export async function generateMetadata({ searchParams }: BlogsPageProps): Promise<Metadata> {
  const state = parseBlogListState(await searchParams)

  // Trang kết quả tìm kiếm là nguồn index bloat kinh điển: vô số URL nội dung
  // trùng nhau. `follow` để crawler vẫn đi tiếp vào các bài bên trong.
  if (state.search) {
    return {
      title: `Search: ${state.search}`,
      description: BLOGS_DESCRIPTION,
      robots: { index: false, follow: true },
    }
  }

  // Canonical TỰ TRỎ VỀ CHÍNH NÓ, dựng bằng đúng buildHref mà giao diện dùng. Nếu
  // trang 2 khai canonical là /blogs thì Google coi nó là bản trùng của trang 1 và
  // loại khỏi index — đúng những bài mà việc đưa phân trang lên URL đang cố cứu.
  const canonical = absoluteUrl(buildHref(state))

  const titleParts = ['Blogs']
  if (state.category !== 'All') titleParts.push(state.category)
  if (state.page > 1) titleParts.push(`Trang ${state.page}`)
  const title = titleParts.join(' — ')

  return {
    title,
    description: BLOGS_DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: `${title} | ${SITE_NAME}`,
      description: BLOGS_DESCRIPTION,
      url: canonical,
      siteName: SITE_NAME,
      locale: BLOG_LOCALE,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description: BLOGS_DESCRIPTION,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogsPageProps) {
  const state = parseBlogListState(await searchParams)

  // Dựng sẵn danh sách + danh mục ở server. Thiếu bước này thì HTML đầu tiên chỉ
  // có dòng "Loading blogs...", nghĩa là link phân trang và tab category không tồn
  // tại cho tới khi JS chạy — crawler không có đường nào đi tới trang 2.
  const [initialBlogs, initialCategories, initialFeatured] = await Promise.all([
    getBlogsForList(buildParams(state)),
    getBlogCategories(),
    // Carousel bị ẩn khi đang tìm kiếm, khỏi tốn một request thừa.
    state.search ? Promise.resolve(null) : getFeaturedBlogs(),
  ])

  return (
    <Suspense>
      <BlogsView
        initialState={state}
        initialBlogs={initialBlogs ?? undefined}
        initialCategories={initialCategories ?? undefined}
        initialFeatured={initialFeatured ?? undefined}
      />
    </Suspense>
  )
}
