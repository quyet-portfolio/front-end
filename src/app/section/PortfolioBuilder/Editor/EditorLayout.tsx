/**
 * EditorLayout — Craft.js <Editor> wrapper + 3-panel layout.
 * Panel: Left (ComponentPanel) | Center (Canvas) | Right (SettingsPanel)
 */
'use client'

import { Editor, Frame, Element } from '@craftjs/core'
import { useEffect, useState } from 'react'
import { craftResolver, CraftContainer } from '@/src/craftjs-components'
import { ComponentPanel } from './Sidebar/ComponentPanel'
import { SettingsPanel } from './Settings/SettingsPanel'
import { GlobalSettingsPanel } from './Settings/GlobalSettingsPanel'
import { EditorToolbar } from './Toolbar/EditorToolbar'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'

interface Portfolio {
  _id: string
  layout: { craftJson: Record<string, any> }
  status: 'draft' | 'published'
  slug?: string
  seo?: { title?: string; description?: string; ogImage?: string }
  themeOverride?: { colors?: Record<string, string>; font?: { heading?: string; body?: string } }
}

interface EditorLayoutProps {
  portfolioId: string
}

type ViewMode = 'desktop' | 'mobile'

function patchCraftJsonParents(craftJson: Record<string, any>): Record<string, any> {
  const patched: Record<string, any> = JSON.parse(JSON.stringify(craftJson))
  for (const [nodeId, node] of Object.entries(patched)) {
    for (const childId of node.nodes ?? []) {
      if (patched[childId]) patched[childId].parent = nodeId
    }
    for (const childId of Object.values(node.linkedNodes ?? {})) {
      if (patched[childId as string]) patched[childId as string].parent = nodeId
    }
  }
  return patched
}

export const EditorLayout = ({ portfolioId }: EditorLayoutProps) => {
  const { fetchPortfolioById } = usePortfolioApi()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leftTab, setLeftTab] = useState<'components' | 'layers'>('components')
  const [rightTab, setRightTab] = useState<'element' | 'global'>('element')
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [publishedSlug, setPublishedSlug] = useState<string | undefined>()

  useEffect(() => {
    fetchPortfolioById(portfolioId)
      .then((data) => {
        setPortfolio(data.portfolio)
        setPublishedSlug(data.portfolio?.slug)
      })
      .catch(() => setError('Failed to load portfolio'))
      .finally(() => setLoading(false))
  }, [portfolioId, fetchPortfolioById])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Could not load portfolio</p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  // Patch missing `parent` fields — old seed data doesn't include them,
  // but Craft.js actions.delete() requires node.data.parent to be set.
  const patchedCraftJson = patchCraftJsonParents(portfolio.layout.craftJson)
  const craftJsonStr = JSON.stringify(patchedCraftJson)

  return (
    <Editor
      resolver={craftResolver}
      onRender={({ render }) => render}
    >
      <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
        {/* Top Toolbar */}
        <EditorToolbar
          portfolioId={portfolioId}
          portfolioName={portfolio.seo?.title || 'My Portfolio'}
          status={portfolio.status}
          slug={publishedSlug}
          onPublishSuccess={(slug) => setPublishedSlug(slug)}
        />

        {/* 3-Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel — Component drag list */}
          <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-700/50">
              {(['components', 'layers'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors
                    ${leftTab === tab
                      ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50'
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {leftTab === 'components' && <ComponentPanel />}
              {leftTab === 'layers' && (
                <div className="p-3 text-xs text-slate-500">Layer panel — coming soon</div>
              )}
            </div>
          </aside>

          {/* Center — Canvas */}
          <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
            {/* Viewport controls */}
            <div className="sticky top-0 z-10 flex justify-center py-2 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex bg-slate-800 rounded-md p-0.5">
                  <button
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1 rounded-sm transition-colors ${viewMode === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1 rounded-sm transition-colors ${viewMode === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
                  >
                    📱 Mobile
                  </button>
                </div>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">Click any section to select · Drag from left panel to add</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-8">
              <div
                className={`mx-auto shadow-2xl shadow-indigo-900/10 border border-slate-800 transition-all duration-300 bg-black-100 ${
                  viewMode === 'desktop' ? 'w-full max-w-[1024px]' : 'w-[400px]'
                }`}
              >
                <Frame data={craftJsonStr}>
                  <Element is={CraftContainer} canvas id="ROOT" />
                </Frame>
              </div>
            </div>
          </main>

          {/* Right Panel — Settings */}
          <aside className="w-64 flex-shrink-0 bg-slate-900 border-l border-slate-700/50 flex flex-col">
            <div className="flex border-b border-slate-700/50 bg-slate-800/20">
              <button
                onClick={() => setRightTab('element')}
                className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors
                  ${rightTab === 'element'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Element
              </button>
              <button
                onClick={() => setRightTab('global')}
                className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors
                  ${rightTab === 'global'
                    ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/50'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                Global
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {rightTab === 'element' && <SettingsPanel />}
              {rightTab === 'global' && portfolio && (
                <GlobalSettingsPanel
                  portfolioId={portfolioId}
                  initialSeo={portfolio.seo}
                  initialTheme={portfolio.themeOverride}
                  onSeoChange={(newSeo) => setPortfolio((p) => p ? { ...p, seo: newSeo } : p)}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </Editor>
  )
}
