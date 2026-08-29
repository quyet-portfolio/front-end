'use client'

import { useCallback, useState } from 'react'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { Upload } from 'antd'
import { ITerm } from '../types'
import { detectFileType, parseTermsFile, ParseTermsResult, TermsFileType } from '../lib/parseTermsFile'

interface UseTermsFileUploadOptions {
  onUnsupportedFile: () => void
}

/**
 * State cho việc chọn file terms + sinh preview.
 *
 * Tách riêng vì cả luồng "tạo flashcard mới từ file" và "thêm terms vào flashcard
 * có sẵn" đều cần y hệt phần này — trước đây hai modal copy-paste nguyên khối.
 */
export const useTermsFileUpload = ({ onUnsupportedFile }: UseTermsFileUploadOptions) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [fileContent, setFileContent] = useState('')
  const [fileType, setFileType] = useState<TermsFileType>('csv')
  const [parseResult, setParseResult] = useState<ParseTermsResult | null>(null)

  const reset = useCallback(() => {
    setFileList([])
    setFileContent('')
    setParseResult(null)
  }, [])

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const type = detectFileType(file.name)
      if (!type) {
        onUnsupportedFile()
        return Upload.LIST_IGNORE
      }
      setFileType(type)

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
        setParseResult(parseTermsFile(content, type))
      }

      // xlsx được gửi nguyên bản base64 lên server để thư viện `xlsx` đọc.
      if (type === 'xlsx') {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }

      return false
    },
    onRemove: reset,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1))
    },
  }

  const previewTerms: ITerm[] = parseResult?.status === 'ok' ? parseResult.terms : []

  return {
    uploadProps,
    fileContent,
    fileType,
    parseResult,
    previewTerms,
    reset,
  }
}
