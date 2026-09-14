'use client'

import { LoginOutlined, LogoutOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Input, Modal, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import SidebarMenu from '@/src/layouts/navbar/SidebarMenu'
import { useAuth } from '@/src/contexts/AuthContext'
import { useFlashCardsStore } from '../store'
import { useState } from 'react'
import ImportTermsModal from './ImportTermsModal'

const NotesHeading = () => {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  const search = useFlashCardsStore((s) => s.search)
  const setSearch = useFlashCardsStore((s) => s.setSearch)
  const refreshFlashCards = useFlashCardsStore((s) => s.refresh)

  const [isOpenPopupAuthen, setOpenPopupAuthen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

  return (
    <div className="flex justify-between gap-2 items-center w-full">
      <SidebarMenu />
      <div className="w-[65%] md:w-[36%]">
        <Input
          value={search ?? ''}
          placeholder="Find notes, term, desc ..."
          size="large"
          allowClear
          aria-label="Search notes"
          onChange={(e) => setSearch(e.target.value)}
          suffix={<SearchOutlined className="text-gray-400" />}
        />
      </div>
      {isAuthenticated ? (
        <div className="flex items-center gap-0 md:gap-6">
          <Tooltip title="Create new note">
            <Button
              type="text"
              shape="circle"
              size="large"
              aria-label="Create new note"
              icon={<PlusCircleOutlined style={{ fontSize: 28 }} />}
              onClick={() => {
                if (!isAuthenticated) {
                  setOpenPopupAuthen(true)
                  return
                }

                router.push('/notes/create')
              }}
            />
          </Tooltip>
          <Tooltip title="Import from file">
            <Button
              type="text"
              shape="circle"
              size="large"
              aria-label="Import notes from file"
              icon={<UploadOutlined style={{ fontSize: 24 }} />}
              onClick={() => {
                if (!isAuthenticated) {
                  setOpenPopupAuthen(true)
                  return
                }

                setImportModalOpen(true)
              }}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div className="flex gap-2 items-center cursor-default py-1">
                      <Avatar
                        src={user?.avatar || undefined}
                        style={{ backgroundColor: '#6366F1' }}
                        size={'large'}
                        icon={<UserOutlined />}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">{user?.name || user?.username}</div>
                        <div className="font-normal">{user?.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: '2',
                  label: (
                    <div onClick={logout}>
                      Log out
                    </div>
                  ),
                  icon: <LogoutOutlined />
                },
              ],
            }}
            placement="bottom"
            trigger={['click']}
          >
            <Avatar className='cursor-pointer' src={user?.avatar || undefined} style={{ backgroundColor: '#6366F1' }} size={'large'} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      ) : (
        <Tooltip title="Login">
          <Button variant="outlined" color="default" onClick={() => router.push('/login')}>
            <LoginOutlined />
          </Button>
        </Tooltip>
      )}
      <Modal
        title="Access denied !!"
        open={isOpenPopupAuthen}
        centered
        closable={false}
        footer={
          <div className="flex justify-end gap-4">
            <Button onClick={() => setOpenPopupAuthen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => router.push('/login')}>
              Log in now
            </Button>
          </div>
        }
      >
        Log in to create a note.
      </Modal>

      <ImportTermsModal
        mode="create"
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        // Nạp lại danh sách tại chỗ thay vì reload cả trang.
        onSuccess={refreshFlashCards}
      />
    </div>
  )
}

export default NotesHeading
