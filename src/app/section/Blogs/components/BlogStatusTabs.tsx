'use client'

import { BlogStatusFilter } from '@/src/lib/types'
import { STATUS_TABS } from '../constants/myBlogs'

interface BlogStatusTabsProps {
  value: BlogStatusFilter
  onChange: (status: BlogStatusFilter) => void
}

const BlogStatusTabs = ({ value, onChange }: BlogStatusTabsProps) => {
  return (
    <div role="tablist" aria-label="Filter blogs by status" className="flex flex-wrap items-center gap-2">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={value === tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200
            ${
              value === tab.key
                ? 'bg-primary border-primary text-white'
                : 'bg-transparent border-blue-950 text-white-100 hover:border-blue-500 hover:text-white'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default BlogStatusTabs
