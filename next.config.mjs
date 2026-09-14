/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Blog featured images are arbitrary user-supplied URLs (any CDN/host),
    // so allow optimizing remote images from any HTTPS host.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async redirects() {
    return [
      // Tính năng Notes đổi tên thành Flashcards. URL cũ đã nằm trong sitemap
      // production và có thể đã được index, nên phải chuyển vĩnh viễn (308) để
      // thứ hạng đi theo sang URL mới thay vì rơi thành 404. Giữ lâu dài.
      // Đặt trong next.config.mjs (không import được TS) nên đường dẫn gõ tay —
      // xem LEGACY_FLASHCARDS_PATH trong src/app/section/Flashcards/routes.ts.
      { source: '/notes', destination: '/flashcards', permanent: true },
      { source: '/notes/:path*', destination: '/flashcards/:path*', permanent: true },
    ]
  },
}

export default nextConfig
