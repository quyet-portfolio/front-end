'use client'

import {
  PlusCircleFilled,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Input } from 'antd'
import { useRouter } from 'next/navigation'
import SidebarMenu from '../../components/Layout/Navbar/SidebarMenu'

const NotesHeading = () => {
  const router = useRouter()

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
      <div className="flex items-center gap-6">
        <PlusCircleFilled
          style={{ fontSize: '32px', }}
          onClick={() => {
            router.push('/')
          }}
        />
        <Avatar style={{ backgroundColor: '#CBACF9' }} size={'large'} icon={<UserOutlined />} />
        {/* <LoginOutlined /> */}
      </div>
    </div>
  )
}

export default NotesHeading
