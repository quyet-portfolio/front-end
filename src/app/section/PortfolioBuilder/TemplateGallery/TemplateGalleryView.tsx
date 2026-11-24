/**
 * TemplateGalleryView — Trang tổng quan Portfolio Builder (/portfolio-builder).
 *  - Header: tài khoản đang đăng nhập.
 *  - Đã có portfolio → MyPortfolioCard (thumbnail bản live, trạng thái, link, Edit / View live).
 *  - Chưa có → hero giới thiệu.
 *  - Gallery template: chọn template (tạo mới) hoặc đổi template (có xác nhận).
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortfolioApi } from '@/src/hooks/usePortfolioApi'
import { useMessageApi } from '@/src/contexts/MessageContext'
import Modal from 'antd/es/modal'
import Segmented from 'antd/es/segmented'
import { TemplateCard } from './TemplateCard'
import { BuilderUserHeader } from './BuilderUserHeader'
import { MyPortfolioCard, type MyPortfolioSummary } from './MyPortfolioCard'

type Category = 'all' | 'developer' | 'designer' | 'student'

const CATEGORY_TABS: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'student', label: 'Student', icon: '🎓' },
]

export const TemplateGalleryView = () => {
  const router = useRouter()
  const messageApi = useMessageApi()
  const { fetchTemplates, createPortfolioFromTemplate, fetchMyPortfolio } = usePortfolioApi()

  const [templates, setTemplates] = useState<any[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [category, setCategory] = useState<Category>('all')
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<MyPortfolioSummary | null>(null)
  const [portfolioLoading, setPortfolioLoading] = useState(true)

  const loadMyPortfolio = useCallback(
    () =>
      fetchMyPortfolio()
        .then((data) => setPortfolio(data?.portfolio ?? null))
        .catch(() => setPortfolio(null))
        .finally(() => setPortfolioLoading(false)),
    [fetchMyPortfolio]
  )

  // Trang đã yêu cầu đăng nhập (layout) → tải portfolio của user
  useEffect(() => {
    void loadMyPortfolio()
  }, [loadMyPortfolio])

  useEffect(() => {
    const cat = category === 'all' ? undefined : category
    fetchTemplates(cat)
      .then((data) => setTemplates(data.templates ?? []))
      .catch(() => setTemplates([]))
      .finally(() => setTemplatesLoading(false))
  }, [category, fetchTemplates])

  const changeCategory = (next: Category) => {
    setTemplatesLoading(true)
    setCategory(next)
  }

  const createFromTemplate = async (templateId: string, replace: boolean) => {
    try {
      setSelectingId(templateId)
      const data = await createPortfolioFromTemplate(templateId, { replace })
      router.push(`/portfolio-builder/editor/${data.portfolio._id}`)
    } catch (err: any) {
      setSelectingId(null)
      // Server báo user đã có portfolio (vd trang chưa kịp tải xong) → tải lại + hỏi xác nhận
      if (err?.response?.status === 409 && !replace) {
        void loadMyPortfolio()
        confirmReplace(templateId)
        return
      }
      console.error('Failed to create portfolio:', err)
      messageApi?.error('Could not create portfolio from this template')
    }
  }

  /** Mỗi user chỉ có 1 portfolio → đổi template = thay layout & theme hiện tại */
  const confirmReplace = (templateId: string) => {
    Modal.confirm({
      title: 'Switch to this template?',
      content:
        'Your current layout and theme will be replaced by this template. Your public link and SEO settings are kept, and your live page stays unchanged until you publish again.',
      okText: 'Switch template',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => createFromTemplate(templateId, true),
    })
  }

  const handleSelectTemplate = (templateId: string) => {
    if (portfolio) {
      confirmReplace(templateId)
      return
    }
    void createFromTemplate(templateId, false)
  }

  const currentTemplateId =
    typeof portfolio?.templateId === 'object' ? portfolio.templateId._id : portfolio?.templateId

  return (
    // relative z-10: nổi trên lớp Spotlight (z-[1]) của layout chung — nếu không
    // vệt sáng tím đè lên thumbnail & card template nền sáng
    <div className="relative z-10 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4">
        <BuilderUserHeader />

        {/* Portfolio của user / hero giới thiệu */}
        {portfolioLoading ? (
          <div className="h-80 rounded-2xl bg-slate-800/60 animate-pulse" />
        ) : portfolio ? (
          <MyPortfolioCard portfolio={portfolio} />
        ) : (
          <div className="relative pt-10 pb-6 text-center">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px]
                rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"
            />
            <h1 className="relative text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Build Your{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Portfolio
              </span>
            </h1>
            <p className="relative text-lg text-slate-400 max-w-xl mx-auto">
              Choose a template, customize it with our drag-and-drop editor, and publish your personal portfolio in
              minutes.
            </p>
          </div>
        )}

        {/* Templates */}
        <section className="mt-14 pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {portfolio ? 'Switch template' : 'Choose a template'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {portfolio
                  ? "Start over with a different look. Your live page won't change until you publish again."
                  : 'Pick a starting point — you can customize everything in the editor.'}
              </p>
            </div>
            <Segmented
              value={category}
              onChange={(v) => changeCategory(v as Category)}
              options={CATEGORY_TABS.map((tab) => ({
                value: tab.id,
                label: `${tab.icon} ${tab.label}`,
              }))}
            />
          </div>

          {templatesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No templates found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tmpl) => (
                <TemplateCard
                  key={tmpl._id}
                  template={tmpl}
                  onSelect={handleSelectTemplate}
                  isSelecting={selectingId === tmpl._id}
                  isCurrent={tmpl._id === currentTemplateId}
                  hasPortfolio={Boolean(portfolio)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
