'use client'

import {
  LoginOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Input, Modal, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useState } from 'react'
import SidebarMenu from '@/src/layouts/navbar/SidebarMenu'
import { useAuth } from '@/src/contexts/AuthContext'

interface BlogsHeaderProps {
  defaultValue?: string
  onSearch: (value: string) => void
}

// Blogs header — mirrors the Notes header layout for a consistent UX:
// hamburger (left) + centered search bar + action icons / account (right).
const BlogsHeader = ({ defaultValue = '', onSearch }: BlogsHeaderProps) => {
  const router = useRouter()
  const { isAuthenticated, logout, user } = useAuth()

  const [value, setValue] = useState<string>(defaultValue)
  const [isOpenPopupAuthen, setOpenPopupAuthen] = useState(false)

  const triggerSearch = () => onSearch(value.trim())

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValue(next)
    // Reset immediately when the field is cleared
    if (next === '') onSearch('')
  }

  const handleCreate = () => {
    if (!isAuthenticated) {
      setOpenPopupAuthen(true)
      return
    }
    router.push('/blogs/create')
  }

  return (
    <div className="flex justify-between items-center w-full">
      <SidebarMenu />

      <div className="w-[65%] md:w-[36%]">
        <Input
          value={value}
          placeholder="Search ..."
          size="large"
          allowClear
          onChange={handleChange}
          onPressEnter={triggerSearch}
          suffix={<SearchOutlined className="cursor-pointer" onClick={triggerSearch} />}
        />
      </div>

      <div className="flex items-center gap-2 md:gap-6">
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
                  label: <div onClick={logout}>Log out</div>,
                  icon: <LogoutOutlined />,
                },
              ],
            }}
            placement="bottom"
            trigger={['click']}
          >
            <Avatar
              className="cursor-pointer"
              style={{ backgroundColor: '#6366F1' }}
              size={'large'}
              icon={<UserOutlined />}
            />
          </Dropdown>
        ) : (
          <Tooltip title="Login">
            <Button size='large' variant="outlined" color="default" onClick={() => router.push('/login')}>
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
        Log in to create a blog.
      </Modal>
    </div>
  )
}

export default BlogsHeader
