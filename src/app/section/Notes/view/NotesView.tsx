import NotesHeading from '../component/NotesHeading'
import ListNotes from '../component/ListNotes'

const NotesView = () => {
  return (
    <div className="h-full my-6 z-10 flex flex-col items-center justify-center gap-6">
      <NotesHeading />
      <ListNotes />
    </div>
  )
}

export default NotesView
