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

/** Build Google Fonts <link> href cho heading + body family (dedupe). */
function buildGoogleFontsHref(heading: string, body: string): string {
  const families = Array.from(new Set([heading, body].filter(Boolean)))
  const params = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;600;700`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

export default async function PublicPortfolioPage(props: Props) {
  const params = await props.params;
  const portfolio = await getPublicPortfolio(params.slug)

  if (!portfolio) {
    notFound()
  }

  const { craftJson } = portfolio.layout
  const colors = portfolio.themeOverride?.colors ?? {}
  const font = portfolio.themeOverride?.font ?? {}
  const headingFont = font.heading || 'Inter'
  const bodyFont = font.body || 'Inter'

  return (
    <>
      {/* Load theme fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={buildGoogleFontsHref(headingFont, bodyFont)} />

      {/* Theme tokens → CSS variables. Element *UI đọc var(--portfolio-*) làm mặc định
          (cascade); prop riêng của element thắng khi được set. */}
      <style>{`
        .pf-root {
          --portfolio-primary: ${colors.primary || '#6366F1'};
          --portfolio-bg: ${colors.background || '#0f172a'};
          --portfolio-text: ${colors.text || '#f8fafc'};
          --portfolio-heading-font: '${headingFont}', sans-serif;
          --portfolio-body-font: '${bodyFont}', sans-serif;
          background: var(--portfolio-bg);
          color: var(--portfolio-text);
          font-family: var(--portfolio-body-font);
        }
        .pf-root h1, .pf-root h2, .pf-root h3, .pf-root h4 {
          font-family: var(--portfolio-heading-font);
        }
      `}</style>

      <div className="pf-root">
        <CraftRenderer craftJson={craftJson} />

        {/* Footer badge */}
        <div className="text-center py-6 text-xs text-slate-600 bg-slate-950">
          Built with{' '}
          <a href="/portfolio-builder" className="text-indigo-500 hover:text-indigo-400 transition-colors">
            Portfolio Builder
          </a>
        </div>
      </div>
    </>
  )
}
