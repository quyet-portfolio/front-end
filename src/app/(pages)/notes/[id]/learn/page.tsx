import LearnView from '@/src/app/section/Notes/view/Learn/LearnView'
import ProtectedRoute from '@/src/components/ProtectedRoute'

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
