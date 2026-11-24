import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PortfolioView } from '@/src/app/section/PortfolioBuilder/PortfolioView'

interface Props {
  params: Promise<{ slug: string }>
}

// NEXT_PUBLIC_API_URL đã gồm hậu tố /api (giống lib/axios.ts, blogServer.ts)
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

async function getPublicPortfolio(slug: string) {
  const res = await fetch(`${API_URL}/portfolio-builder/p/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.portfolio
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const portfolio = await getPublicPortfolio(params.slug)
  if (!portfolio) {
    return { title: 'Portfolio Not Found' }
  }

  const title = portfolio.seo?.title || 'Portfolio'
  const description = portfolio.seo?.description || 'Personal portfolio page.'
  const ogImage: string | undefined = portfolio.seo?.ogImage
  const safeOgImage = ogImage && /^https?:\/\//i.test(ogImage.trim()) ? ogImage.trim() : undefined

  return {
    // absolute: không nối hậu tố "| <site name>" — đây là trang của user, không phải của site
    title: { absolute: title },
    description,
    alternates: { canonical: `/p/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/p/${params.slug}`,
      images: safeOgImage ? [safeOgImage] : [],
    },
  }
}

export default async function PublicPortfolioPage(props: Props) {
  const params = await props.params
  const portfolio = await getPublicPortfolio(params.slug)

  if (!portfolio) {
    notFound()
  }

  return <PortfolioView craftJson={portfolio.layout.craftJson} theme={portfolio.themeOverride} />
}
