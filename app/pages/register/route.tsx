import axios from 'axios'
import React, { useState } from 'react'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/users', {
        name,
        email,
        password,
      })
      if (response.status == 200) {
        alert('Create account successful')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="py-20">
      <h1 className="heading">
        <span className="text-purple">Register Account</span>
      </h1>
      <div className="mt-9 w-1/3 my-0 mx-auto">
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="bg-zinc-50 text-black-200 h-9 w-full px-3 py-2 border rounded-md"
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
