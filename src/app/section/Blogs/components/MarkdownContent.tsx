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
