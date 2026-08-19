import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/src/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Trang quản trị và trang xác thực: không có giá trị tìm kiếm, lại làm
        // loãng crawl budget. Các trang này còn được gắn noindex ở metadata —
        // disallow chỉ chặn crawl, noindex mới chặn hiển thị.
        disallow: [
          '/blogs/create',
          '/blogs/edit/',
          '/blogs/my-blogs',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
