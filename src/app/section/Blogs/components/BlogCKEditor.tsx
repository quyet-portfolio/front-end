'use client'

import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  List,
  Heading,
  Image,
  ImageUpload,
  Base64UploadAdapter as CKBase64UploadAdapter,
  MediaEmbed,
  Table,
  TableToolbar,
  Indent,
  IndentBlock,
  BlockQuote,
  Essentials,
  Paragraph,
  Undo,
  Code,
  CodeBlock,
  Autoformat,
  SourceEditing,
  GeneralHtmlSupport,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'
import './editor.css'

interface BlogCKEditorProps {
  value?: string
  onChange?: (value: string) => void
}

const TOOLBAR_ITEMS = [
  'heading',
  '|',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  '|',
  'link',
  'blockQuote',
  'code',
  'codeBlock',
  '|',
  'bulletedList',
  'numberedList',
  '|',
  'uploadImage',
  'mediaEmbed',
  '|',
  'insertTable',
  '|',
  'outdent',
  'indent',
  '|',
  'undo',
  'redo',
  '|',
  'sourceEditing',
]

const CODE_BLOCK_LANGUAGES = [
  { language: 'plaintext', label: 'Plain text' },
  { language: 'javascript', label: 'JavaScript' },
  { language: 'typescript', label: 'TypeScript' },
  { language: 'jsx', label: 'JSX / TSX' },
  { language: 'html', label: 'HTML' },
  { language: 'css', label: 'CSS' },
  { language: 'python', label: 'Python' },
  { language: 'java', label: 'Java' },
  { language: 'csharp', label: 'C#' },
  { language: 'cpp', label: 'C++' },
  { language: 'go', label: 'Go' },
  { language: 'rust', label: 'Rust' },
  { language: 'bash', label: 'Bash / Shell' },
  { language: 'sql', label: 'SQL' },
  { language: 'json', label: 'JSON' },
  { language: 'yaml', label: 'YAML' },
  { language: 'markdown', label: 'Markdown' },
]

const BlogCKEditor: React.FC<BlogCKEditorProps> = ({ value = '', onChange }) => {
  return (
    <div className="blog-editor-wrapper text-black">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: 'GPL',
          plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Link,
            List,
            Image,
            ImageUpload,
            CKBase64UploadAdapter,
            MediaEmbed,
            Table,
            TableToolbar,
            Indent,
            IndentBlock,
            BlockQuote,
            Undo,
            Code,
            CodeBlock,
            Autoformat,
            SourceEditing,
            GeneralHtmlSupport,
          ],
          htmlSupport: {
            allow: [{ name: /.*/, attributes: true, classes: true, styles: true }],
          },
          toolbar: { items: TOOLBAR_ITEMS, shouldNotGroupWhenFull: true },
          codeBlock: {
            languages: CODE_BLOCK_LANGUAGES,
          },
          image: {
            toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side'],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          if (onChange) {
            onChange(data)
          }
        }}
      />
    </div>
  )
}

export default BlogCKEditor
