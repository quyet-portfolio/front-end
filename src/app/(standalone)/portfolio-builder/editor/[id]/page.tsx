'use client'

import { useParams } from 'next/navigation'
import { EditorLayout } from '@/src/app/section/PortfolioBuilder/Editor/EditorLayout'

// Auth guard nằm ở (standalone)/portfolio-builder/layout.tsx
export default function EditorPage() {
  const params = useParams()
  const id = params?.id as string

  if (!id) return null

  return <EditorLayout portfolioId={id} />
}
