import type { Metadata } from 'next'
import { Button, Result } from 'antd'

// Cần khai báo tường minh: metadata của page.tsx bị bỏ qua khi notFound() được
// gọi, nên nếu không có dòng này trang sẽ kế thừa `index, follow` từ root layout
// và nằm cạnh thẻ noindex mà Next tự chèn — hai chỉ thị mâu thuẫn trên cùng một trang.
export const metadata: Metadata = {
  title: 'Note not found',
  robots: { index: false, follow: true },
}

const NoteNotFound = () => (
  <Result
    status="404"
    title="Note not found"
    subTitle="This note does not exist, or it has been deleted."
    extra={
      <Button type="primary" href="/notes">
        Back to notes
      </Button>
    }
  />
)

export default NoteNotFound
