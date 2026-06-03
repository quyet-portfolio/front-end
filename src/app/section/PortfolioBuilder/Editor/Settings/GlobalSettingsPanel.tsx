'use client'

import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { useState, useCallback } from 'react'
import { ColorField } from '@/src/craftjs-components/shared/ColorField'
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import Button from 'antd/es/button'

interface GlobalSettingsPanelProps {
  portfolioId: string
  initialSeo?: { title?: string; description?: string; ogImage?: string }
  initialTheme?: { colors?: Record<string, string>; font?: { heading?: string; body?: string } }
  onSeoChange?: (seo: any) => void
  onThemeChange?: (theme: { colors?: Record<string, string>; font?: { heading?: string; body?: string } }) => void
}

/** Google Fonts được hỗ trợ (load runtime ở trang public /p/[slug]) */
const FONT_OPTIONS = ['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lora', 'Playfair Display']

export const GlobalSettingsPanel = ({
  portfolioId,
  initialSeo,
  initialTheme,
  onSeoChange,
  onThemeChange,
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
      onThemeChange?.(theme)
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
            <Input
              size="small"
              value={seo.title || ''}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              placeholder="My Portfolio"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <Input.TextArea
              rows={3}
              value={seo.description || ''}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              placeholder="A brief description of myself..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">OG Image URL</label>
            <Input
              size="small"
              value={seo.ogImage || ''}
              onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <Button block size="small" loading={savingSeo} onClick={handleSeoSave}>
            {savingSeo ? 'Saving...' : 'Save SEO'}
          </Button>
        </div>

        {/* Theme Settings */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white text-sm border-b border-slate-700/50 pb-1">
            Global Theme
          </h3>
          <p className="text-xs text-slate-500 mb-2 leading-relaxed">
            Elements follow these theme colors &amp; fonts by default. Per-element overrides
            (set in an element&apos;s settings) take priority; use &quot;↺ Theme&quot; there to follow the theme again.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Color</label>
            <ColorField
              value={theme.colors?.primary || '#6366F1'}
              onChange={(hex) => setTheme({ ...theme, colors: { ...theme.colors, primary: hex } })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Background Color</label>
            <ColorField
              value={theme.colors?.background || '#0f172a'}
              onChange={(hex) => setTheme({ ...theme, colors: { ...theme.colors, background: hex } })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Text Color</label>
            <ColorField
              value={theme.colors?.text || '#f8fafc'}
              onChange={(hex) => setTheme({ ...theme, colors: { ...theme.colors, text: hex } })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Heading Font</label>
            <Select
              size="small"
              className="w-full"
              value={theme.font?.heading || 'Inter'}
              onChange={(v) => setTheme({ ...theme, font: { ...theme.font, heading: v } })}
              options={FONT_OPTIONS.map((f) => ({ value: f, label: f }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Body Font</label>
            <Select
              size="small"
              className="w-full"
              value={theme.font?.body || 'Inter'}
              onChange={(v) => setTheme({ ...theme, font: { ...theme.font, body: v } })}
              options={FONT_OPTIONS.map((f) => ({ value: f, label: f }))}
            />
          </div>

          <Button block size="small" loading={savingTheme} onClick={handleThemeSave}>
            {savingTheme ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>
    </div>
  )
}
