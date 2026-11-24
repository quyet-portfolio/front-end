'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { PreviewLayout } from '@/src/app/section/PortfolioBuilder/Preview/PreviewLayout'

export default function PreviewPage() {
  const params = useParams()
  const id = params?.id as string
  // ?embed=1: nhúng trong iframe thumbnail ở trang tổng quan → ẩn banner
  const embed = useSearchParams()?.get('embed') === '1'

  if (!id) return null

  return <PreviewLayout portfolioId={id} embed={embed} />
}
