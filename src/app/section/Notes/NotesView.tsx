import NotesHeading from './NotesHeading'
import NotesList from './NotesList'

const NotesView = () => {
  return (
    <div className='h-full'>
      <div className="my-6 z-10 flex flex-col items-center justify-center gap-6">
        <NotesHeading />
        <NotesList />
      </div>
    </div>
  )
}

export default NotesView
