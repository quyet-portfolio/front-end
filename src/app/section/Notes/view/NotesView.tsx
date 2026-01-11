import NotesHeading from '../component/NotesHeading'
import NotesList from '../component/ListNotes'

const NotesView = () => {
  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      <NotesHeading />
      <NotesList />
    </div>
  )
}

export default NotesView
