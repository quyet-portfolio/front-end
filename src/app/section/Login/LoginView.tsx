'use client'

import { Button, Input } from 'antd'
import { MagicCard } from '../../components/Layout/ui/MagicCard'

const LoginView = () => {
  return (
    <div className="mt-20 mx-auto w-[100%] md:w-[50%] lg:w-[40%] pt-6">
      <MagicCard
        duration={Math.floor(Math.random() * 10000) + 10000}
        borderRadius="1.75rem"
        style={{
          width: '100%',
          background: 'rgb(4,7,29)',
          backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
          borderRadius: `calc(1.75rem* 0.96)`,
        }}
        className=" min-h-[400px] w-full flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <div className="flex flex-col gap-6 w-[90%] lg:w-[70%] mx-auto h-full">
          <div className="mx-auto mb-10">
            <h1 className="text-start text-xl md:text-4xl font-bold">Login</h1>
          </div>
          <Input placeholder="Email" size="large" />
          <Input.Password placeholder="Password" size="large" />
          <Button size='large'>Login</Button>
        </div>
      </MagicCard>
    </div>
  )
}

export default LoginView
