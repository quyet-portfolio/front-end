'use client'

import { Button, Form, Input } from 'antd'
import { MagicCard } from '@/src/components/ui/MagicCard'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi } from '@/src/lib/api/auth'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { PASSWORD_REGEX } from '@/src/lib/constants'

const ResetPasswordView = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form] = Form.useForm()

  const messageApi = useMessageApi()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: { newPassword: string; confirmPassword: string }) => {
    if (!token) {
      messageApi?.error('Missing or invalid reset token')
      return
    }

    setLoading(true)

    try {
      await authApi.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      })
      messageApi?.success('Password reset successfully. Please log in.')
      // redirect=/ vì trang này thường mở từ link email (không có history để back())
      router.replace('/login?redirect=/')
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Failed to reset password')
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
            <h1 className="text-start text-xl md:text-4xl font-bold">Reset password</h1>
          </div>
          <Form form={form} onFinish={handleSubmit} className="w-full flex flex-col gap-2">
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: 'This field is required' },
                {
                  pattern: PASSWORD_REGEX,
                  message: 'Password should be included 8 - 20 characters including number, letter, special character',
                },
              ]}
            >
              <Input.Password placeholder="New password" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'This field is required' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match'))
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" size="large" />
            </Form.Item>
            <div className="flex flex-col gap-2">
              <Button size="large" className="w-full" htmlType="submit" loading={loading}>
                Reset password
              </Button>
              <Button className="w-full" variant="text" color="default" onClick={() => router.replace('/login?redirect=/')}>
                Back to log in
              </Button>
            </div>
          </Form>
        </div>
      </MagicCard>
    </div>
  )
}

export default ResetPasswordView
