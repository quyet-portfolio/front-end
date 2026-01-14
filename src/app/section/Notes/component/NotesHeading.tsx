'use client'

import { LoginOutlined, LogoutOutlined, PlusCircleOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Input, Modal, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import SidebarMenu from '../../../components/Layout/Navbar/SidebarMenu'
import { useAuth } from '@/src/contexts/AuthContext'
import { useFlashCardsStore } from '../store'
import { useState } from 'react'

const NotesHeading = () => {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  const paramsGetFlashCards = useFlashCardsStore((state) => state)

  const [isOpenPopupAuthen, setOpenPopupAuthen] = useState(false)

  return (
    <div className="flex justify-between items-center w-full">
      <SidebarMenu />
      <div className="w-[60%] md:w-[30%]">
        <Input
          placeholder="Find notes, term, desc ..."
          size="large"
          onChange={(e) => {
            useFlashCardsStore.setState({
              ...paramsGetFlashCards,
              search: e.target.value,
            })
          }}
          suffix={<SearchOutlined className="cursor-pointer" onClick={() => window.alert('Searching ... ')} />}
        />
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <Tooltip title="Create new note" trigger={'hover'}>
          <PlusCircleOutlined
            style={{ fontSize: '32px' }}
            disabled={!isAuthenticated}
            onClick={() => {
              if (!isAuthenticated) {
                setOpenPopupAuthen(true)
                return
              }

              router.push('/notes/create')
            }}
          />
        </Tooltip>
        {isAuthenticated ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <div className="flex gap-2 items-center cursor-default py-1">
                      <Avatar style={{ backgroundColor: '#6366F1' }} size={'large'} icon={<UserOutlined />} />
                      <div className="flex flex-col gap-1">
                        <div className="font-semibold">{user?.username}</div>
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
            <Avatar className='cursor-pointer' style={{ backgroundColor: '#6366F1' }} size={'large'} icon={<UserOutlined />} />
          </Dropdown>
        ) : (
          <Tooltip title="Login">
            <Button variant="outlined" color="default" onClick={() => router.push('/login')}>
              <LoginOutlined />
            </Button>
          </Tooltip>
        )}
      </div>
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
    </div>
  )
}

export default NotesHeading
