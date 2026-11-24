import React from 'react'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import BlogDetailView from '../../../section/Blogs/BlogDetailView'
import BlogsHeader from '../../../section/Blogs/components/BlogsHeader'
import RelatedPosts from '../../../section/Blogs/components/RelatedPosts'
import { getBlogForMetadata, getRelatedBlogs } from '@/src/lib/api/blogServer'
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

  // Dựng lại canonical từ slug HIỆN TẠI của bài: URL được yêu cầu có thể là một
  // slug cũ, và canonical trỏ về slug cũ thì việc đổi slug thành vô nghĩa.
  const canonicalUrl = absoluteUrl(`/blogs/${blog.slug}`)

  return {
    // `absolute` để tiêu đề bài không bị nối thêm hậu tố thương hiệu — tiêu đề ở
    // đây đã dài tới 83 ký tự, thêm nữa là chắc chắn bị SERP cắt cụt.
    title: { absolute: blog.title },
    description,
    keywords: blog.tags?.length ? blog.tags : undefined,
    authors: blog.author?.username ? [{ name: blog.author.username }] : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'article',
      title: blog.title,
      description,
      url: canonicalUrl,
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

  // API tra được bài qua `previousSlugs`, nên URL này có thể là một slug đã nghỉ
  // hưu. permanentRedirect (308) chứ không phải redirect (307): 307 giữ nguyên URL
  // cũ trong index, chỉ 308/301 mới chuyển thứ hạng sang slug mới.
  if (blog.slug !== slug) {
    permanentRedirect(`/blogs/${blog.slug}`)
  }

  const canonical = absoluteUrl(`/blogs/${blog.slug}`)
  const description = toMetaDescription(blog.excerpt || blog.content)
  const relatedBlogs = await getRelatedBlogs(blog.slug)

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
        <RelatedPosts blogs={relatedBlogs} />
      </div>
    </div>
  )
}
