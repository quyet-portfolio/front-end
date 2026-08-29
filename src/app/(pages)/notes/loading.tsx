import { Spin } from 'antd'

// Hiện trong lúc server component của các route con đang fetch, thay cho màn
// hình trắng.
const NotesLoading = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <Spin size="large" />
  </div>
)

export default NotesLoading
