'use client'

import { useState } from 'react'
import Tabs from 'antd/es/tabs'
import MarkdownContent from './MarkdownContent'

interface MarkdownEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const PLACEHOLDER = `# Tiêu đề

Nội dung bằng **Markdown**. Hỗ trợ ảnh, bảng, danh sách...

\`\`\`tsx
export default function Hello() {
  return <div>Hello</div>
}
\`\`\``

// Lightweight Markdown editor: raw textarea + live preview reusing MarkdownContent,
// so the preview matches exactly how the blog renders. Value/onChange are injected by
// the parent AntD Form.Item, mirroring the CKEditor component contract.
const MarkdownEditor = ({ value = '', onChange }: MarkdownEditorProps) => {
  const [tab, setTab] = useState('write')

  return (
    <Tabs
      activeKey={tab}
      onChange={setTab}
      items={[
        {
          key: 'write',
          label: 'Write',
          children: (
            <textarea
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="w-full min-h-[400px] rounded-md border border-gray-700 bg-[#0d1117] p-4 font-mono text-sm text-gray-100 outline-none focus:border-blue-500"
            />
          ),
        },
        {
          key: 'preview',
          label: 'Preview',
          children: (
            <div className="min-h-[400px] rounded-md bg-[#0d1117] p-4">
              {value.trim().length > 0 ? (
                <MarkdownContent content={value} className="pb-0" />
              ) : (
                <p className="text-gray-500">Chưa có nội dung để xem trước.</p>
              )}
            </div>
          ),
        },
      ]}
    />
  )
}

export default MarkdownEditor
