'use client'

import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { useState, useCallback } from 'react'

interface GlobalSettingsPanelProps {
  portfolioId: string
  initialSeo?: { title?: string; description?: string; ogImage?: string }
  initialTheme?: { colors?: Record<string, string>; font?: { heading?: string; body?: string } }
  onSeoChange?: (seo: any) => void
}

export const GlobalSettingsPanel = ({
  portfolioId,
  initialSeo,
  initialTheme,
  onSeoChange,
}: GlobalSettingsPanelProps) => {
  const { updateSeo, updateTheme } = usePortfolioApi()

  const [seo, setSeo] = useState(initialSeo || { title: '', description: '', ogImage: '' })
  const [theme, setTheme] = useState(
    initialTheme || {
      colors: { primary: '#6366F1', background: '#0f172a', text: '#f8fafc' },
      font: { heading: 'Inter', body: 'Inter' },
    }
  )
  const [savingSeo, setSavingSeo] = useState(false)
  const [savingTheme, setSavingTheme] = useState(false)

  const handleSeoSave = async () => {
    try {
      setSavingSeo(true)
      await updateSeo(portfolioId, seo)
      onSeoChange?.(seo)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingSeo(false)
    }
  }

  const handleThemeSave = async () => {
    try {
      setSavingTheme(true)
      await updateTheme(portfolioId, theme)
    } catch (err) {
      console.error(err)
    } finally {
      setSavingTheme(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Settings Sections */}
      <div className="p-4 space-y-6">
        
        {/* SEO Settings */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm border-b border-slate-700/50 pb-1">
            SEO & Metadata
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Page Title</label>
            <input
              type="text"
              value={seo.title || ''}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
              placeholder="My Portfolio"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={seo.description || ''}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white resize-none"
              placeholder="A brief description of myself..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">OG Image URL</label>
            <input
              type="text"
              value={seo.ogImage || ''}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white"
              placeholder="https://..."
            />
          </div>
          <button
            onClick={handleSeoSave}
            disabled={savingSeo}
            className="w-full py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            {savingSeo ? 'Saving...' : 'Save SEO'}
          </button>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm border-b border-slate-700/50 pb-1">
            Global Theme
          </h3>
          <p className="text-xs text-slate-500 mb-2 leading-relaxed">
            These settings will be applied to the published site. Note: Some elements in the editor provide their own background and text colors.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Color</label>
            <input
              type="color"
              value={theme.colors?.primary || '#6366F1'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  colors: { ...theme.colors, primary: e.target.value },
                })
              }
              className="w-full h-9 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Background Color</label>
            <input
              type="color"
              value={theme.colors?.background || '#0f172a'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  colors: { ...theme.colors, background: e.target.value },
                })
              }
              className="w-full h-9 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Text Color</label>
            <input
              type="color"
              value={theme.colors?.text || '#f8fafc'}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  colors: { ...theme.colors, text: e.target.value },
                })
              }
              className="w-full h-9 rounded cursor-pointer"
            />
          </div>

          <button
            onClick={handleThemeSave}
            disabled={savingTheme}
            className="w-full py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            {savingTheme ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </div>
    </div>
  )
}
