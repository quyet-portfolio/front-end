import ProtectedRoute from '@/src/components/ProtectedRoute'

/** Portfolio Builder yêu cầu đăng nhập ngay từ trang chọn template. */
export default function PortfolioBuilderGalleryLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
