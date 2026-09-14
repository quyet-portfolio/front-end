import NotesHeading from '../component/NotesHeading'
import ListNotes from '../component/ListNotes'
import { FlashCardsResponse } from '../types'

const NotesView = ({ initialData }: { initialData?: FlashCardsResponse }) => {
  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      {/* Trang danh sách không có tiêu đề hiển thị (thanh tìm kiếm chiếm chỗ đó),
          nhưng vẫn cần một <h1> để crawler và screen reader biết trang nói về gì. */}
      <h1 className="sr-only">Notes — flashcard sets</h1>
      <NotesHeading />
      <ListNotes initialData={initialData} />
    </div>
  )
}

export default NotesView
