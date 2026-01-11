'use client'

import { MagicCard } from '../../../components/Layout/ui/MagicCard'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { authApi } from '@/src/lib/api/auth'
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/src/lib/constants'
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const RegisterView = () => {
  const router = useRouter()
  const [form] = Form.useForm()

  const messageApi = useMessageApi()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      await authApi.register({
        ...values,
        username: values?.username
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .trim(),
      })
      messageApi?.success('Sign up an account successfully')
      router.push('/login')
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Sign up an account failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-24 mx-auto max-w-[600px] w-[100%] md:w-[50%] lg:w-[40%] pt-6">
      <MagicCard
        duration={Math.floor(Math.random() * 10000) + 10000}
        borderRadius="1.75rem"
        style={{
          width: '100%',
          background: 'rgb(4,7,29)',
          backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
          borderRadius: `calc(1.75rem* 0.96)`,
        }}
        className="h-full w-full flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <div className="flex flex-col gap-6 w-[90%] mx-auto h-full">
          <div className="mx-auto mb-10">
            <h1 className="text-start text-xl md:text-4xl font-bold">Sign up</h1>
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
            <Form.Item name="username" rules={[{ required: true, message: 'This field is required' }]}>
              <Input maxLength={191} placeholder="Your name" size="large" />
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
                Sign up
              </Button>
              <Button className="w-full" variant="text" color="default" onClick={() => router.push('/login')}>
                Already have an account? Log in
              </Button>
            </div>
          </Form>
        </div>
      </MagicCard>
    </div>
  )
}

export default RegisterView
