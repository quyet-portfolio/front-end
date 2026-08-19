import React from 'react'
import type { Metadata } from 'next'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'
import { getBlogForMetadata } from '@/src/lib/api/blogServer'
import { BLOG_LANG, BLOG_LOCALE, SITE_NAME, absoluteUrl } from '@/src/lib/site'
import { toMetaDescription } from '@/src/utils/seo'

// Server component: `generateMetadata` chỉ chạy được ở đây. Nội dung vẫn do
// BlogDetailView ('use client') render như cũ — trang này chỉ bọc thêm phần <head>.
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

export default function BlogDetailPage() {
  return (
    <div className="my-6 z-10 flex flex-col gap-6">
      <BlogsHeader />
      {/* lang phải nằm ở wrapper do server render. Đặt nó trong BlogDetailView thì
          thuộc tính chỉ xuất hiện sau khi client fetch xong — crawler đọc HTML thô
          sẽ không thấy tín hiệu ngôn ngữ nào. */}
      <div lang={BLOG_LANG}>
        <BlogDetailView />
      </div>
    </div>
  )
}
