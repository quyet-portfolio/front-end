/**
 * TemplateCard — Card hiển thị 1 template trong gallery.
 */
'use client'

interface Template {
  _id: string
  name: string
  slug: string
  previewImage?: string
  category: 'developer' | 'designer' | 'student'
  defaultTheme: {
    colors: { primary: string; background: string; text: string }
    font: { heading: string }
  }
}

interface TemplateCardProps {
  template: Template
  onSelect: (id: string) => void
  isSelecting?: boolean
}

const CATEGORY_LABELS = {
  developer: { label: 'Developer', icon: '💻', color: '#6366F1' },
  designer: { label: 'Designer', icon: '🎨', color: '#f97316' },
  student: { label: 'Student', icon: '🎓', color: '#22c55e' },
}

const TEMPLATE_PREVIEW_BG = {
  'developer-classic': 'from-slate-900 to-slate-800',
  'designer-minimal': 'from-white to-gray-100',
  'student-fresh': 'from-green-50 to-emerald-100',
}

export const TemplateCard = ({ template, onSelect, isSelecting }: TemplateCardProps) => {
  const cat = CATEGORY_LABELS[template.category] ?? CATEGORY_LABELS.developer
  const { colors } = template.defaultTheme

  return (
    <div
      className="group relative rounded-2xl overflow-hidden border border-slate-700/50
        hover:border-indigo-500/60 transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
      onClick={() => !isSelecting && onSelect(template._id)}
    >
      {/* Preview area */}
      <div
        className="h-48 relative overflow-hidden"
        style={{ background: colors.background }}
      >
        {/* Fake mini-sections preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{ background: colors.primary }}
          >
            {template.name.charAt(0)}
          </div>
          <div className="w-32 h-2 rounded-full opacity-60" style={{ background: colors.primary }} />
          <div className="w-20 h-1.5 rounded-full bg-slate-500 opacity-30" />
          <div className="flex gap-1 mt-1">
            {[40, 56, 32].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded-full opacity-40"
                style={{ width: w, background: colors.primary }}
              />
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 bg-slate-900 border-t border-slate-700/30">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-white text-sm">{template.name}</h3>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${cat.color}20`,
              color: cat.color,
            }}
          >
            {cat.icon} {cat.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Font: {template.defaultTheme.font.heading}
        </p>

        {/* Color palette */}
        <div className="flex gap-1.5 mb-3">
          {Object.values(colors).map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border border-slate-700"
              style={{ background: c }}
              title={c}
            />
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(template._id)
          }}
          disabled={isSelecting}
          className="w-full py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg
            hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
            transition-all shadow-md shadow-indigo-600/20"
        >
          {isSelecting ? 'Creating...' : 'Use This Template →'}
        </button>
      </div>
    </div>
  )
}
