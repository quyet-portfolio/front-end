'use client'

import { useParams } from 'next/navigation'
import { PreviewLayout } from '@/src/app/section/PortfolioBuilder/Preview/PreviewLayout'

export default function PreviewPage() {
  const params = useParams()
  const id = params?.id as string

  if (!id) return null

  return <PreviewLayout portfolioId={id} />
}
