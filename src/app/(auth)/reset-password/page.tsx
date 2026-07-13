import { Suspense } from 'react'
import ResetPasswordView from '../../section/Auth/ResetPassword/ResetPasswordView'

export const metadata = {
  title: 'Reset password',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordView />
    </Suspense>
  )
}
