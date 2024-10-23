'use client'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import React, { FormEvent, useState } from 'react'

const LoginPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })
    if (res?.error) {
      //   setError(res.error as string);
      console.log('Error: ', res.error as string)
    }
    if (res?.ok) {
      return router.push('/')
    }
  }

  return (
    <div className="py-20">
      <h1 className="heading">
        <span className="text-purple">Login now</span>
      </h1>
      <div className="mt-9 w-1/3 my-0 mx-auto">
        <form className="space-y-6" onSubmit={handleRegister}>
          {/* <div>
            <input
              type="text"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div> */}
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
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
