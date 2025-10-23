'use client'

import React, { use } from 'react'
import {
  HomeOutlined,
  LoginOutlined,
  PlusCircleFilled,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Input } from 'antd'
import { useRouter } from 'next/navigation'

const NotesHeading = () => {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        <HomeOutlined
          style={{ fontSize: '32px', cursor: "pointer" }}
          onClick={() => {
            router.push('/')
          }}
        />
      </div>
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
