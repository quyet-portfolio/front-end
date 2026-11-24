/**
 * EditorLayout — Craft.js <Editor> wrapper + 3-panel layout.
 * Panel: Left (ComponentPanel) | Center (Canvas) | Right (SettingsPanel)
 */
'use client'

import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { useEffect, useMemo, useState } from 'react'
import Segmented from 'antd/es/segmented'
import { craftResolver, CraftContainer } from '@/src/craftjs-components'
import { ComponentPanel } from './Sidebar/ComponentPanel'
import { SettingsPanel } from './Settings/SettingsPanel'
import { GlobalSettingsPanel } from './Settings/GlobalSettingsPanel'
import { EditorToolbar } from './Toolbar/EditorToolbar'
import { useEditorSave } from './useEditorSave'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { buildGoogleFontsHref, buildThemeCss, type PortfolioTheme } from '../theme'

interface Portfolio {
  _id: string
  layout: { craftJson: Record<string, any> }
  status: 'draft' | 'published'
  slug?: string
  seo?: { title?: string; description?: string; ogImage?: string }
  themeOverride?: PortfolioTheme
  hasUnpublishedChanges?: boolean
}

interface EditorLayoutProps {
  portfolioId: string
}

type ViewMode = 'desktop' | 'mobile'

/**
 * Seed data cũ thiếu field `parent`, nhưng Craft.js actions.delete() cần
 * node.data.parent → điền lại từ nodes / linkedNodes trước khi deserialize.
 */
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

/**
 * Ghi nhận JSON ngay sau khi Frame deserialize xong làm mốc "đã lưu".
 * Effect của component con chạy trước khi <Editor> đăng ký onNodesChange,
 * nên mọi thay đổi sau mốc này mới tính là chưa lưu.
 */
const SaveBaseline = ({ onReady }: { onReady: (json: string) => void }) => {
  const { query } = useEditor()
  useEffect(() => {
    onReady(query.serialize())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export const EditorLayout = ({ portfolioId }: EditorLayoutProps) => {
  const { fetchPortfolioById } = usePortfolioApi()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leftTab, setLeftTab] = useState<'components' | 'layers'>('components')
  const [rightTab, setRightTab] = useState<'element' | 'global'>('element')
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [isPublished, setIsPublished] = useState(false)
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)

  // Mọi lần lưu bản nháp thành công → bản live đã cũ hơn bản nháp
  const editorSave = useEditorSave(portfolioId, () => setHasUnpublishedChanges(true))

  useEffect(() => {
    fetchPortfolioById(portfolioId)
      .then((data) => {
        const p: Portfolio = data.portfolio
        setPortfolio(p)
        setIsPublished(p.status === 'published')
        setHasUnpublishedChanges(Boolean(p.hasUnpublishedChanges))
      })
      .catch(() => setError('Failed to load portfolio'))
      .finally(() => setLoading(false))
  }, [portfolioId, fetchPortfolioById])

  // Frame chỉ đọc `data` một lần khi mount → chỉ tính lại khi layout gốc đổi,
  // không phải mỗi lần đổi theme / SEO.
  const craftJsonStr = useMemo(
    () => (portfolio ? JSON.stringify(patchCraftJsonParents(portfolio.layout.craftJson)) : ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [portfolio?.layout.craftJson]
  )

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

  return (
    <Editor resolver={craftResolver} onNodesChange={editorSave.handleNodesChange}>
      {/* Theme tokens + fonts giống hệt trang public (PortfolioView) */}
      <link rel="stylesheet" href={buildGoogleFontsHref(portfolio.themeOverride)} />
      <style>{buildThemeCss('.pf-canvas', portfolio.themeOverride)}</style>

      <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden">
        {/* Top Toolbar */}
        <EditorToolbar
          portfolioId={portfolioId}
          portfolioName={portfolio.seo?.title || 'My Portfolio'}
          isPublished={isPublished}
          hasUnpublishedChanges={hasUnpublishedChanges}
          saveStatus={editorSave.status}
          isDirty={editorSave.isDirty}
          save={editorSave.save}
          onPublished={() => {
            setIsPublished(true)
            setHasUnpublishedChanges(false)
          }}
        />

        {/* 3-Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel — Component drag list */}
          <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 flex flex-col">
            {/* Tabs */}
            <div className="p-2 border-b border-slate-700/50">
              <Segmented
                block
                value={leftTab}
                onChange={(v) => setLeftTab(v as 'components' | 'layers')}
                options={[
                  { value: 'components', label: 'Components' },
                  { value: 'layers', label: 'Layers' },
                ]}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {leftTab === 'components' && <ComponentPanel />}
              {leftTab === 'layers' && (
                <div className="p-3 text-xs text-slate-500">Layer panel — coming soon</div>
              )}
            </div>
          </aside>

          {/* Center — Canvas */}
          <main className="flex-1 min-w-0 flex flex-col bg-slate-950 overflow-hidden relative">
            {/* Viewport controls */}
            <div className="sticky top-0 z-10 flex justify-center py-2 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
              <div className="flex items-center gap-4 text-xs">
                <Segmented
                  value={viewMode}
                  onChange={(v) => setViewMode(v as ViewMode)}
                  options={[
                    { value: 'desktop', label: '🖥️ Desktop' },
                    { value: 'mobile', label: '📱 Mobile' },
                  ]}
                />
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">Click any section to select · Drag from left panel to add</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Desktop: canvas giãn hết vùng giữa — độ rộng nội dung do từng
                  section tự giới hạn (max-w-*), giống trang public. */}
              <div
                className={`pf-canvas mx-auto min-h-full shadow-2xl shadow-indigo-900/10 border border-slate-800 transition-[width] duration-300 ${
                  viewMode === 'desktop' ? 'w-full' : 'w-[400px]'
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
            <div className="p-2 border-b border-slate-700/50 bg-slate-800/20">
              <Segmented
                block
                value={rightTab}
                onChange={(v) => setRightTab(v as 'element' | 'global')}
                options={[
                  { value: 'element', label: 'Element' },
                  { value: 'global', label: 'Global' },
                ]}
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {rightTab === 'element' && <SettingsPanel />}
              {rightTab === 'global' && (
                <GlobalSettingsPanel
                  portfolioId={portfolioId}
                  initialSeo={portfolio.seo}
                  initialTheme={portfolio.themeOverride}
                  onSeoChange={(newSeo) => setPortfolio((p) => (p ? { ...p, seo: newSeo } : p))}
                  onThemeChange={(newTheme) => {
                    setPortfolio((p) => (p ? { ...p, themeOverride: newTheme } : p))
                    setHasUnpublishedChanges(true)
                  }}
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Đặt sau Frame: effect chạy sau khi toàn bộ cây canvas đã mount */}
      <SaveBaseline onReady={editorSave.setBaseline} />
    </Editor>
  )
}
