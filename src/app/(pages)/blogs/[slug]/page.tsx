import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'
import { getBlogForMetadata } from '@/src/lib/api/blogServer'
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd, serializeJsonLd } from '@/src/lib/jsonLd'
import { BLOG_LANG, BLOG_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'
import { toMetaDescription } from '@/src/utils/seo'

// Server component: `generateMetadata` chỉ chạy được ở đây, và đây cũng là nơi
// duy nhất lấy được nội dung bài vào HTML đầu tiên.
type BlogDetailPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const canonical = absoluteUrl(`/blogs/${slug}`)
  const blog = await getBlogForMetadata(slug)

  if (!blog) {
    // Slug hỏng hoặc bài đã xoá: chặn index thay vì để Google lưu một URL rỗng.
    return {
      title: 'Blog not found',
      robots: { index: false, follow: true },
      alternates: { canonical },
    }
  }

  const description = toMetaDescription(blog.excerpt || blog.content)
  const publishedTime = blog.publishedAt || blog.createdAt

  return {
    // `absolute` để tiêu đề bài không bị nối thêm hậu tố thương hiệu — tiêu đề ở
    // đây đã dài tới 83 ký tự, thêm nữa là chắc chắn bị SERP cắt cụt.
    title: { absolute: blog.title },
    description,
    keywords: blog.tags?.length ? blog.tags : undefined,
    authors: blog.author?.username ? [{ name: blog.author.username }] : undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: blog.title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: BLOG_LOCALE,
      publishedTime,
      modifiedTime: blog.updatedAt,
      authors: blog.author?.username ? [blog.author.username] : undefined,
      tags: blog.tags?.length ? blog.tags : undefined,
      images: blog.featuredImage ? [{ url: blog.featuredImage, alt: blog.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: blog.featuredImage ? [blog.featuredImage] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params

  // Cùng tham số với lần gọi trong generateMetadata nên Next dedupe lại thành một
  // request duy nhất cho mỗi lượt render.
  const blog = await getBlogForMetadata(slug)

  if (!blog) {
    // 404 THẬT (trước đây trang vẫn trả 200 kèm chữ "404", Google index như trang
    // hợp lệ). Request từ server luôn ẩn danh nên bản nháp của chính tác giả cũng
    // rơi vào nhánh này — not-found.tsx fetch lại kèm token để họ vẫn xem được.
    notFound()
  }

  const canonical = absoluteUrl(`/blogs/${slug}`)
  const description = toMetaDescription(blog.excerpt || blog.content)

  return (
    <div className="my-6 z-10 flex flex-col gap-6">
      {/* JSON-LD: mở khoá rich result (ngày đăng, tác giả, ảnh) và đường dẫn phân
          cấp trên SERP. Breadcrumb UI đã có sẵn nhưng Google không suy ra được
          cấu trúc từ markup thường. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildBlogPostingJsonLd(blog, canonical, description)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildBreadcrumbJsonLd(blog, canonical)) }}
      />

      <BlogsHeader />
      {/* lang phải nằm ở wrapper do server render. Đặt nó trong BlogDetailView thì
          thuộc tính chỉ xuất hiện sau khi client fetch xong — crawler đọc HTML thô
          sẽ không thấy tín hiệu ngôn ngữ nào. */}
      <div lang={BLOG_LANG}>
        <BlogDetailView initialBlog={blog} />
      </div>
    </div>
  )
}
