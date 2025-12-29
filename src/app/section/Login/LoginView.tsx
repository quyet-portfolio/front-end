'use client'

import { Button, Input } from 'antd'
import { MagicCard } from '../../components/Layout/ui/MagicCard'
import { useState } from 'react'
import { useAuth } from '@/src/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { authApi } from '@/src/lib/api/auth'

const LoginView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await authApi.login({ email, password })
      login(data.accessToken, data.refreshToken, data.user)
      router.push('/blogs')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
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
        className=" min-h-[400px] w-full flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        <div className="flex flex-col gap-6 w-[90%] lg:w-[70%] mx-auto h-full">
          <div className="mx-auto mb-10">
            <h1 className="text-start text-xl md:text-4xl font-bold">Login</h1>
          </div>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" size="large" />
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            size="large"
          />
          <Button size="large" onClick={handleSubmit} loading={loading}>
            Login
          </Button>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        </div>
      </MagicCard>
    </div>
  )
}

export default LoginView
