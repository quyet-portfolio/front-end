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
}

export default nextConfig
