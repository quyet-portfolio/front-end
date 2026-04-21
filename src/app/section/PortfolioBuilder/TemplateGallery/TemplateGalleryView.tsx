/**
 * TemplateGalleryView — Trang chọn template portfolio.
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { TemplateCard } from './TemplateCard'
import { useAuth } from '@/src/contexts/AuthContext'

type Category = 'all' | 'developer' | 'designer' | 'student'

const CATEGORY_TABS: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'student', label: 'Student', icon: '🎓' },
]

export const TemplateGalleryView = () => {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { fetchTemplates, createPortfolioFromTemplate, fetchMyPortfolio } = usePortfolioApi()

  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category>('all')
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [existingPortfolioId, setExistingPortfolioId] = useState<string | null>(null)

  // Check nếu user đã có portfolio → hiện nút "Edit Portfolio"
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyPortfolio().then((data) => {
        if (data?.portfolio?._id) setExistingPortfolioId(data.portfolio._id)
      }).catch(() => {})
    }
  }, [isAuthenticated, fetchMyPortfolio])

  useEffect(() => {
    setLoading(true)
    const cat = category === 'all' ? undefined : category
    fetchTemplates(cat)
      .then((data) => setTemplates(data.templates ?? []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [category, fetchTemplates])

  const handleSelectTemplate = async (templateId: string) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/portfolio-builder')
      return
    }
    try {
      setSelectingId(templateId)
      const data = await createPortfolioFromTemplate(templateId)
      router.push(`/portfolio-builder/editor/${data.portfolio._id}`)
    } catch (err) {
      console.error('Failed to create portfolio:', err)
      setSelectingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="relative pt-20 pb-12 px-4 text-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
          rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        <h1 className="relative text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Build Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Portfolio
          </span>
        </h1>
        <p className="relative text-lg text-slate-400 max-w-xl mx-auto mb-8">
          Choose a template, customize it with our drag-and-drop editor, and publish your personal portfolio in minutes.
        </p>

        {existingPortfolioId && (
          <button
            onClick={() => router.push(`/portfolio-builder/editor/${existingPortfolioId}`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold
              rounded-full shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105"
          >
            ✏️ Continue Editing Your Portfolio
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold
                border transition-all duration-200
                ${category === tab.id
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No templates found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tmpl) => (
              <TemplateCard
                key={tmpl._id}
                template={tmpl}
                onSelect={handleSelectTemplate}
                isSelecting={selectingId === tmpl._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
