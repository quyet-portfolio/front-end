import { Suspense } from 'react'
import LoginView from '../../section/Auth/Login/LoginView'

export const metadata = {
  title: 'Login',
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginView />
    </Suspense>
  )
}
