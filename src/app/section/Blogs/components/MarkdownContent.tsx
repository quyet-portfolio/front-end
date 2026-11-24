'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { Components } from 'react-markdown'
import 'highlight.js/styles/github-dark.css'
import './markdown.css'
import { cn } from '@/src/lib/utils'
import CodeBlock from './CodeBlock'

interface MarkdownContentProps {
  content: string
  className?: string
}

// react-markdown renders raw HTML as text by default (no rehype-raw), so markdown
// content is safe to render without an extra sanitizer.
const COMPONENTS: Components = {
  pre: CodeBlock,
  // Trang chi tiết đã render <h1>{blog.title}</h1> ở banner. H1 trong nội dung tạo
  // H1 kép, và ở nhiều bài nó còn KHÁC tiêu đề nên Google nhận hai chủ đề mâu
  // thuẫn cho cùng một trang. Hạ xuống H2 để dàn heading còn đúng một gốc.
  // `node` phải bị loại: react-markdown truyền nó vào props và React sẽ cảnh báo
  // vì đó không phải thuộc tính DOM hợp lệ.
  h1: ({ node, children, ...props }) => <h2 {...props}>{children}</h2>,
}

const MarkdownContent = ({ content, className }: MarkdownContentProps) => {
  return (
    <div
      className={cn(
        'markdown-body prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-img:rounded-md pb-10',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={COMPONENTS}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
