'use client'
import { FormEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/actions/register'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()
  const ref = useRef<HTMLFormElement>(null)

  const handleRegister = async (formData: FormData) => {
    const r = await register({
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
    })
    ref.current?.reset()
    if (r?.error) {
      // setError(r.error);
      console.log('Error: ', r.error as string)
      return
    } else {
      return router.push('pages/auth/signin')
    }
  }

  return (
    <div className="py-20">
      <h1 className="heading">
        <span className="text-purple">Register Account</span>
      </h1>
      <div className="mt-9 w-1/3 my-0 mx-auto">
        <form className="space-y-6" ref={ref} action={handleRegister}>
          <div>
            <input
              type="text"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-primary-foreground text-purple hover:bg-slate-700 w-full px-3 py-2 border rounded-md"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
