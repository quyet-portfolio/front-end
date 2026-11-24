import ProtectedRoute from '@/src/components/ProtectedRoute'

/** Editor + Preview: full màn hình (không dùng layout chung của site) và yêu cầu đăng nhập. */
export default function PortfolioBuilderStandaloneLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
