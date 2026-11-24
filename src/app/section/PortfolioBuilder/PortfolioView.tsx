/**
 * PortfolioView — Render 1 portfolio hoàn chỉnh (theme + fonts + nội dung).
 * Dùng chung cho trang public /p/[slug] (SSR) và trang Preview để 2 nơi giống hệt nhau.
 * KHÔNG import @craftjs/core.
 */
import React from 'react'
import { CraftRenderer } from './CraftRenderer'
import { buildGoogleFontsHref, buildThemeCss, type PortfolioTheme } from './theme'

interface PortfolioViewProps {
  craftJson: Record<string, any>
  theme?: PortfolioTheme | null
}

export const PortfolioView = ({ craftJson, theme }: PortfolioViewProps) => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={buildGoogleFontsHref(theme)} />
      <style>{buildThemeCss('.pf-root', theme)}</style>

      <div className="pf-root min-h-screen">
        <CraftRenderer craftJson={craftJson} />

        {/* Footer badge */}
        <div className="text-center py-6 text-xs text-pf-muted border-t border-pf-border">
          Built with{' '}
          <a href="/portfolio-builder" className="text-pf-primary hover:opacity-80 transition-opacity">
            Portfolio Builder
          </a>
        </div>
      </div>
    </>
  )
}
