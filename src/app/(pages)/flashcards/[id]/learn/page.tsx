import type { Metadata } from 'next'
import LearnView from '@/src/app/section/Notes/view/Learn/LearnView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

// Phiên học gắn với từng người dùng, không có nội dung gì cho công cụ tìm kiếm —
// nội dung thật của bộ thẻ nằm ở /notes/[id].
export const metadata: Metadata = {
  title: 'Learn',
  robots: { index: false, follow: false },
}

// Học đòi hỏi session gắn với user. Không có guard này, khách vãng lai bấm
// "Learn now" sẽ nhận 401 từ /start rồi rơi vào màn "An error occurred" — thông
// báo không nói gì về nguyên nhân thật là chưa đăng nhập.
const LearnPage = () => {
  return (
    <ProtectedRoute>
      <LearnView />
    </ProtectedRoute>
  )
}

export default LearnPage
