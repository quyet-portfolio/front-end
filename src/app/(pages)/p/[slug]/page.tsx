import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CraftRenderer } from '@/src/app/section/PortfolioBuilder/CraftRenderer'

interface Props {
  params: Promise<{ slug: string }>
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function getPublicPortfolio(slug: string) {
  const res = await fetch(`${API}/api/portfolio-builder/p/${slug}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  })

  if (!res.ok) return null
  const data = await res.json()
  return data.portfolio
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const portfolio = await getPublicPortfolio(params.slug)
  if (!portfolio) {
    return { title: 'Portfolio Not Found' }
  }

  return {
    title: portfolio.seo?.title || 'Portfolio',
    description: portfolio.seo?.description || 'Personal portfolio page.',
    openGraph: {
      title: portfolio.seo?.title || 'Portfolio',
      description: portfolio.seo?.description || 'Personal portfolio page.',
      images: portfolio.seo?.ogImage ? [portfolio.seo.ogImage] : [],
    },
  }
}

export default async function PublicPortfolioPage(props: Props) {
  const params = await props.params;
  const portfolio = await getPublicPortfolio(params.slug)

  if (!portfolio) {
    notFound()
  }

  const { craftJson } = portfolio.layout

  return (
    <div>
      {/* Apply theme colors as CSS variables */}
      <style>{`
        :root {
          --portfolio-primary: ${portfolio.themeOverride?.colors?.primary || '#6366F1'};
          --portfolio-bg: ${portfolio.themeOverride?.colors?.background || '#0f172a'};
          --portfolio-text: ${portfolio.themeOverride?.colors?.text || '#f8fafc'};
        }
      `}</style>

      <CraftRenderer craftJson={craftJson} />

      {/* Footer badge */}
      <div className="text-center py-6 text-xs text-slate-600 bg-slate-950">
        Built with{' '}
        <a href="/portfolio-builder" className="text-indigo-500 hover:text-indigo-400 transition-colors">
          Portfolio Builder
        </a>
      </div>
    </div>
  )
}
