'use client'

import { LoginOutlined, LogoutOutlined, PlusCircleFilled, SearchOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Input, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import SidebarMenu from '../../components/Layout/Navbar/SidebarMenu'
import { useAuth } from '@/src/contexts/AuthContext'

const NotesHeading = () => {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  const items = [
    {
      key: '1',
      label: (
        <Tooltip title="Logout" placement='bottom'>
          <LogoutOutlined onClick={logout} />
        </Tooltip>
      ),
    },
  ]

  return (
    <div className="flex justify-between items-center w-full">
      <SidebarMenu />
      <div className="w-[30%]">
        <Input
          placeholder="Find something ..."
          size="large"
          suffix={<SearchOutlined className="cursor-pointer" onClick={() => window.alert('Searching ... ')} />}
        />
      </div>
      {isAuthenticated ? (
        <div className="flex items-center gap-6">
          <Tooltip title="Create">
            <PlusCircleFilled
              style={{ fontSize: '32px' }}
              onClick={() => {
                router.push('/notes/create')
              }}
            />
          </Tooltip>
          <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
            <Avatar style={{ backgroundColor: '#CBACF9' }} size={'large'} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      ) : (
        <LoginOutlined />
      )}
    </div>
  )
}

export default NotesHeading
