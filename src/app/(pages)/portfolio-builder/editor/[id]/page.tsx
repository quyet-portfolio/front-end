'use client'

import { EditorLayout } from '@/src/app/section/PortfolioBuilder/Editor/EditorLayout'
import { useAuth } from '@/src/contexts/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function EditorPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?redirect=/portfolio-builder')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null
  if (!id) return null

  return <EditorLayout portfolioId={id} />
}
