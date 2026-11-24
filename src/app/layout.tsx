import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './provider'
import { AuthProvider } from '../contexts/AuthContext'
import { MessageProvider } from '../contexts/MessageContext'
import { QueryProvider } from '../providers/QueryProvider'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // Bắt buộc phải có: thiếu metadataBase thì Next sinh og:image/canonical dạng
  // đường dẫn tương đối, thứ mà crawler mạng xã hội không giải được.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Front-end Developer & Blog`,
    // Trang con chỉ cần khai báo title ngắn; bài blog tự dùng `absolute` để không
    // bị nối hậu tố (tiêu đề bài vốn đã dài).
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — Front-end Developer & Blog`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Front-end Developer & Blog`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <AntdRegistry>
            <MessageProvider>
              <QueryProvider>
                <AuthProvider>{children}</AuthProvider>
              </QueryProvider>
            </MessageProvider>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  )
}
