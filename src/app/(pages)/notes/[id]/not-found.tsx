import { Button, Result } from 'antd'

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
