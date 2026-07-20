'use client'

import { useRef, useState, isValidElement } from 'react'
import type { ReactNode } from 'react'

interface CodeBlockProps {
  children?: ReactNode
}

// Extract "language-xxx" → "xxx" from the child <code> element rendered by rehype-highlight
const getLanguage = (children: ReactNode): string => {
  if (!isValidElement(children)) return ''
  const className = (children.props as { className?: string }).className || ''
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : ''
}

// Custom <pre> renderer for react-markdown: wraps the highlighted code block with a
// toolbar (language label + copy button). Reads text from the live DOM on copy so it
// works regardless of the nested highlight spans.
const CodeBlock = ({ children }: CodeBlockProps) => {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const language = getLanguage(children)

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? ''
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (insecure context) — ignore silently
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        {language && <span className="code-block__lang">{language}</span>}
        <button type="button" className="code-block__copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  )
}

export default CodeBlock
