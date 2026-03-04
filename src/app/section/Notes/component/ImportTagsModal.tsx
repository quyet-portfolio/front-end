'use client'

import { useMessageApi } from '@/src/contexts/MessageContext'
import { flashcardApi } from '@/src/lib/api/notes'
import { InboxOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { Button, Modal, Upload, Space, Typography, Alert, Table, Progress, Tabs } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'
import { useState, useCallback } from 'react'

const { Dragger } = Upload
const { Title, Text } = Typography

interface ImportTagsModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  flashcardId: string
  currentTagCount: number
}

interface PreviewData {
  term: string
  definition: string
  related?: string
}

const ImportTagsModal = ({ open, onClose, onSuccess, flashcardId, currentTagCount }: ImportTagsModalProps) => {
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [fileContent, setFileContent] = useState<string>('')
  const [fileType, setFileType] = useState<'csv' | 'json' | 'xlsx'>('csv')
  const [previewData, setPreviewData] = useState<PreviewData[]>([])
  const [activeTab, setActiveTab] = useState('upload')

  const detectFileType = (filename: string): 'csv' | 'json' | 'xlsx' | null => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (ext === 'csv') return 'csv'
    if (ext === 'json') return 'json'
    if (ext === 'xlsx' || ext === 'xls') return 'xlsx'
    return null
  }

  const parseCSV = (content: string): PreviewData[] => {
    const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '')
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map((h) =>
      h
        .toLowerCase()
        .trim()
        .replace(/^["']|["']$/g, ''),
    )
    const termIndex = headers.findIndex((h) => h === 'term' || h === 'từ' || h === 'word' || h === 'phrase')
    const defIndex = headers.findIndex(
      (h) => h === 'definition' || h === 'định nghĩa' || h === 'meaning' || h === 'nghĩa',
    )
    const relatedIndex = headers.findIndex((h) => h === 'related' || h === 'liên quan' || h === 'extra')

    if (termIndex === -1 || defIndex === -1) return []

    const data: PreviewData[] = []
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''))
      if (columns.length > Math.max(termIndex, defIndex)) {
        const term = columns[termIndex] || ''
        const definition = columns[defIndex] || ''
        const related = relatedIndex >= 0 ? columns[relatedIndex] || '' : ''
        if (term && definition) {
          data.push({ term, definition, related })
        }
      }
    }
    return data
  }

  const parseJSON = (content: string): PreviewData[] => {
    try {
      const data = JSON.parse(content)
      if (!Array.isArray(data)) return []
      return data
        .map((item: any) => ({
          term: String(item.term || item.từ || item.word || item.phrase || ''),
          definition: String(item.definition || item['định nghĩa'] || item.meaning || item.nghĩa || ''),
          related: String(item.related || item['liên quan'] || item.extra || ''),
        }))
        .filter((item) => item.term && item.definition)
    } catch {
      return []
    }
  }

  const generatePreview = useCallback((content: string, type: 'csv' | 'json' | 'xlsx') => {
    try {
      if (type === 'csv') {
        setPreviewData(parseCSV(content))
      } else if (type === 'json') {
        setPreviewData(parseJSON(content))
      } else {
        setPreviewData([])
      }
    } catch {
      setPreviewData([])
    }
  }, [])

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file) => {
      const type = detectFileType(file.name)
      if (!type) {
        messageApi?.error('Only CSV, JSON, or Excel (.xlsx) files are supported')
        return Upload.LIST_IGNORE
      }
      setFileType(type)

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileContent(content)
        generatePreview(content, type)
      }

      if (type === 'xlsx') {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }

      return false
    },
    onRemove: () => {
      setFileList([])
      setFileContent('')
      setPreviewData([])
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1))
    },
  }

  const handleSubmit = async () => {
    if (!fileContent) {
      messageApi?.error('Please select a file to import')
      return
    }

    // Check if importing would exceed the limit
    if (currentTagCount + previewData.length > 1000) {
      messageApi?.error(`Cannot import ${previewData.length} tags. Maximum 1000 tags allowed. Current: ${currentTagCount}`)
      return
    }

    try {
      setLoading(true)
      const result = await flashcardApi.importTags(flashcardId, {
        fileContent,
        fileType,
      })
      messageApi?.success(`Successfully imported ${result.importedCount} tags! Total: ${result.totalTags} tags`)
      onSuccess()
      handleClose()
    } catch (error: any) {
      messageApi?.error(error.response?.data?.message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFileList([])
    setFileContent('')
    setPreviewData([])
    setActiveTab('upload')
    onClose()
  }

  const downloadSampleCSV = () => {
    const csvContent = `term,definition,related
Hello,Xin chao,Greeting
Goodbye,Tam biet,Farewell
Thank you,Cam on,Polite expression
Computer,May tinh,Electronic device
Book,Sach,Reading material`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'flashcard_tags_sample.csv'
    link.click()
  }

  const downloadSampleJSON = () => {
    const jsonContent = JSON.stringify(
      [
        { term: 'Hello', definition: 'Xin chao', related: 'Greeting' },
        { term: 'Goodbye', definition: 'Tam biet', related: 'Farewell' },
        { term: 'Thank you', definition: 'Cam on', related: 'Polite expression' },
        { term: 'Computer', definition: 'May tinh', related: 'Electronic device' },
        { term: 'Book', definition: 'Sach', related: 'Reading material' },
      ],
      null,
      2,
    )

    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'flashcard_tags_sample.json'
    link.click()
  }

  const previewColumns = [
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
      ellipsis: true,
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
      ellipsis: true,
    },
    {
      title: 'Related',
      dataIndex: 'related',
      key: 'related',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
  ]

  const remainingSlots = 1000 - currentTagCount

  const items = [
    {
      key: 'upload',
      label: 'Upload File',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message={`Current: ${currentTagCount} tags | Remaining: ${remainingSlots} slots | Maximum: 1000 tags`}
            type="info"
            showIcon
          />

          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support for CSV, JSON, Excel (.xlsx) files. Max size 5MB.</p>
          </Dragger>

          {fileType === 'xlsx' && fileContent && (
            <Alert
              message="Excel file selected"
              description="Preview not available for Excel files. Data will be processed after clicking Import."
              type="info"
              showIcon
              icon={<FileExcelOutlined />}
            />
          )}

          {previewData.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Preview ({previewData.length} tags to import)</Text>
                <Progress 
                  percent={Math.round(((currentTagCount + previewData.length) / 1000) * 100)} 
                  size="small" 
                  style={{ width: 150 }}
                  format={(percent) => `${currentTagCount + previewData.length}/1000`}
                />
              </div>
              {currentTagCount + previewData.length > 1000 && (
                <Alert
                  message="Warning: Importing these tags will exceed the 1000 tag limit"
                  type="error"
                  showIcon
                />
              )}
              <Table
                dataSource={previewData.slice(0, 5)}
                columns={previewColumns}
                pagination={false}
                size="small"
                rowKey={(record, index) => `${record.term}-${index}`}
              />
              {previewData.length > 5 && (
                <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
                  ... and {previewData.length - 5} more tags
                </Text>
              )}
            </>
          )}
        </Space>
      ),
    },
    {
      key: 'sample',
      label: 'Download Sample',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Alert
            message="Instructions"
            description="File must have columns: 'term', 'definition', and 'related' (optional). You can also use Vietnamese column names: 'tu', 'dinh nghia', 'lien quan'."
            type="info"
            showIcon
          />

          <Space wrap>
            <Button icon={<DownloadOutlined />} onClick={downloadSampleCSV}>
              Download CSV Sample
            </Button>
            <Button icon={<DownloadOutlined />} onClick={downloadSampleJSON}>
              Download JSON Sample
            </Button>
          </Space>

          <div style={{ padding: 16, borderRadius: 8 }} className='border'>
            <Title level={5}>CSV Example:</Title>
            <pre style={{ margin: 0, fontSize: 12 }}>
              {`term,definition,related
Hello,Xin chao,Greeting
Goodbye,Tam biet,Farewell
Computer,May tinh,Electronic device`}
            </pre>
          </div>

          <div style={{ padding: 16, borderRadius: 8 }} className='border'>
            <Title level={5}>JSON Example:</Title>
            <pre style={{ margin: 0, fontSize: 12 }}>
              {`[
  {
    "term": "Hello",
    "definition": "Xin chao",
    "related": "Greeting"
  },
  {
    "term": "Goodbye",
    "definition": "Tam biet"
  }
]`}
            </pre>
          </div>
        </Space>
      ),
    },
  ]

  return (
    <Modal
      title="Import Tags to Flashcard"
      open={open}
      onCancel={handleClose}
      width={700}
      footer={
        <Space>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={!fileContent || currentTagCount + previewData.length > 1000}
          >
            Import Tags
          </Button>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        </Space>
      }
      maskClosable={!loading}
      closable={!loading}
    >
      <div style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </Modal>
  )
}

export default ImportTagsModal
