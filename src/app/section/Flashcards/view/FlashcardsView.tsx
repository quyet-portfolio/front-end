import FlashcardsHeading from '../component/FlashcardsHeading'
import FlashcardList from '../component/FlashcardList'
import { FlashcardsResponse } from '../types'

const FlashcardsView = ({ initialData }: { initialData?: FlashcardsResponse }) => {
  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      {/* Trang danh sách không có tiêu đề hiển thị (thanh tìm kiếm chiếm chỗ đó),
          nhưng vẫn cần một <h1> để crawler và screen reader biết trang nói về gì. */}
      <h1 className="sr-only">Flashcards</h1>
      <FlashcardsHeading />
      <FlashcardList initialData={initialData} />
    </div>
  )
}

export default FlashcardsView
