'use client'

import { Button, Form, Input } from 'antd'
import { MagicCard } from '../../../components/Layout/ui/MagicCard'
import { useState } from 'react'
import { useAuth } from '@/src/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { authApi } from '@/src/lib/api/auth'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/src/lib/constants'

const LoginView = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [form] = Form.useForm()

  const messageApi = useMessageApi()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const data = await authApi.login(values)
      login(data.accessToken, data.refreshToken, data.user)
      router.push('/notes')
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-24 mx-auto max-w-[600px] w-[100%] pt-6">
      <MagicCard
        duration={Math.floor(Math.random() * 10000) + 10000}
        borderRadius="1.75rem"
        style={{
          width: '100%',
          background: 'rgb(4,7,29)',
          backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
          borderRadius: `calc(1.75rem* 0.96)`,
        }}
        className="w-full flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <div className="flex flex-col gap-6 w-[90%] lg:w-[70%] mx-auto h-full">
          <div className="mx-auto mb-10">
            <h1 className="text-start text-xl md:text-4xl font-bold">Log in</h1>
          </div>
          <Form form={form} onFinish={handleSubmit} className="w-full flex flex-col gap-2">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'This field is required' },
                {
                  pattern: EMAIL_REGEX,
                  message: 'Invalid email address!',
                },
              ]}
            >
              <Input maxLength={191} placeholder="Email address" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'This field is required' },
                {
                  pattern: PASSWORD_REGEX,
                  message: 'Password should be included 8 - 20 characters including number, letter, special character',
                },
              ]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
            <div className="flex flex-col gap-2">
              <Button size="large" className="w-full" htmlType="submit" loading={loading}>
                Log in
              </Button>
              <Button className="w-full" variant="text" color="default" onClick={() => router.push('/register')}>
                New to Notes? Create an account
              </Button>
            </div>
          </Form>
        </div>
      </MagicCard>
    </div>
  )
}

export default LoginView
