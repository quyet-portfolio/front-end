'use client'

import { useMessageApi } from '@/src/contexts/MessageContext'
import { flashcardApi } from '@/src/lib/api/notes'
import { InboxOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, Modal, Progress, Space, Table, Tabs, Typography, Upload } from 'antd'
import { useState } from 'react'
import { useTermsFileUpload } from '../hook/useTermsFileUpload'
import {
  MAX_IMPORT_FILE_BYTES,
  MAX_TERMS_PER_FLASHCARD,
  SAMPLE_CSV,
  SAMPLE_JSON,
  downloadTextFile,
  formatBytes,
} from '../lib/parseTermsFile'

const { Dragger } = Upload
const { TextArea } = Input
const { Title, Text } = Typography

type ImportTermsModalProps = {
  open: boolean
  onClose: () => void
  onSuccess: () => void
} & (
  | {
      /** Tạo flashcard mới từ file — modal tự hỏi title/description. */
      mode: 'create'
    }
  | {
      /** Thêm terms vào flashcard đã có — cần biết số terms hiện tại để chặn vượt hạn mức. */
      mode: 'append'
      flashcardId: string
      currentTermCount: number
    }
)

const PREVIEW_COLUMNS = [
  { title: 'Term', dataIndex: 'term', key: 'term', ellipsis: true },
  { title: 'Definition', dataIndex: 'definition', key: 'definition', ellipsis: true },
  {
    title: 'Related',
    dataIndex: 'related',
    key: 'related',
    ellipsis: true,
    render: (text: string) => text || '-',
  },
]

const CSV_EXAMPLE = `term,definition,related
Hello,A common greeting,Greeting
Goodbye,A parting phrase,Farewell
Computer,An electronic computing device,Electronic device`

const JSON_EXAMPLE = `[
  {
    "term": "Hello",
    "definition": "A common greeting",
    "related": "Greeting"
  },
  {
    "term": "Goodbye",
    "definition": "A parting phrase"
  }
]`

const ImportTermsModal = (props: ImportTermsModalProps) => {
  const { open, onClose, onSuccess, mode } = props

  const [form] = Form.useForm()
  const messageApi = useMessageApi()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('upload')

  const { uploadProps, fileContent, fileType, parseResult, previewTerms, reset } = useTermsFileUpload({
    onUnsupportedFile: () => messageApi?.error('Only CSV, JSON, or Excel (.xlsx) files are supported'),
    onFileTooLarge: (limit) => messageApi?.error(`File is too large. Maximum size is ${limit}.`),
  })

  const currentTermCount = mode === 'append' ? props.currentTermCount : 0
  const remainingSlots = MAX_TERMS_PER_FLASHCARD - currentTermCount
  const totalAfterImport = currentTermCount + previewTerms.length
  const exceedsLimit = totalAfterImport > MAX_TERMS_PER_FLASHCARD

  const handleClose = () => {
    if (mode === 'create') form.resetFields()
    reset()
    setActiveTab('upload')
    onClose()
  }

  const handleImport = async (values?: { title: string; description?: string }) => {
    if (!fileContent) {
      messageApi?.error('Please select a file to import')
      return
    }

    if (exceedsLimit) {
      messageApi?.error(
        `Cannot import ${previewTerms.length} terms. Maximum ${MAX_TERMS_PER_FLASHCARD} terms allowed. Current: ${currentTermCount}`,
      )
      return
    }

    try {
      setLoading(true)

      if (mode === 'create') {
        const result = await flashcardApi.importFlashCards({
          title: values!.title,
          description: values!.description,
          fileContent,
          fileType,
        })
        messageApi?.success(`Successfully imported ${result.importedCount} terms!`)
      } else {
        const result = await flashcardApi.importTerms(props.flashcardId, { fileContent, fileType })
        messageApi?.success(
          `Successfully imported ${result.importedCount} terms! Total: ${result.totalTerms} terms`,
        )
      }

      onSuccess()
      handleClose()
    } catch (error: any) {
      messageApi?.error(error.response?.data?.message || 'Import failed')
    } finally {
      setLoading(false)
    }
  }

  const uploadTab = (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {mode === 'append' && (
        <Alert
          message={`Current: ${currentTermCount} terms | Remaining: ${remainingSlots} slots | Maximum: ${MAX_TERMS_PER_FLASHCARD} terms`}
          type="info"
          showIcon
        />
      )}

      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for CSV, JSON, Excel (.xlsx) files. Max size {formatBytes(MAX_IMPORT_FILE_BYTES)}.
        </p>
      </Dragger>

      {parseResult?.status === 'preview-unavailable' && (
        <Alert
          message="Excel file selected"
          description="Preview not available for Excel files. Data will be processed after clicking Import."
          type="info"
          showIcon
          icon={<FileExcelOutlined />}
        />
      )}

      {parseResult?.status === 'error' && (
        <Alert message="Could not read this file" description={parseResult.message} type="error" showIcon />
      )}

      {parseResult?.status === 'ok' && previewTerms.length === 0 && (
        <Alert
          message="No terms found"
          description="The file was read successfully but contains no row with both a term and a definition."
          type="warning"
          showIcon
        />
      )}

      {previewTerms.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Preview ({previewTerms.length} terms to import)</Text>
            {mode === 'append' ? (
              <Progress
                percent={Math.round((totalAfterImport / MAX_TERMS_PER_FLASHCARD) * 100)}
                size="small"
                style={{ width: 150 }}
                format={() => `${totalAfterImport}/${MAX_TERMS_PER_FLASHCARD}`}
              />
            ) : (
              <Progress
                percent={Math.round((previewTerms.length / MAX_TERMS_PER_FLASHCARD) * 100)}
                size="small"
                style={{ width: 150 }}
                format={() => `${previewTerms.length}/${MAX_TERMS_PER_FLASHCARD}`}
              />
            )}
          </div>

          {exceedsLimit && (
            <Alert
              message={`Warning: Importing these terms will exceed the ${MAX_TERMS_PER_FLASHCARD} term limit`}
              type="error"
              showIcon
            />
          )}

          <Table
            dataSource={previewTerms.slice(0, 5)}
            columns={PREVIEW_COLUMNS}
            pagination={false}
            size="small"
            rowKey={(record, index) => `${record.term}-${index}`}
          />

          {previewTerms.length > 5 && (
            <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
              ... and {previewTerms.length - 5} more terms
            </Text>
          )}
        </>
      )}
    </Space>
  )

  const sampleTab = (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Alert
        message="Instructions"
        description="File must have columns: 'term', 'definition', and 'related' (optional). You can also use Vietnamese column names: 'từ', 'định nghĩa', 'liên quan'."
        type="info"
        showIcon
      />

      <Space wrap>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadTextFile(SAMPLE_CSV, 'flashcard_sample.csv', 'text/csv;charset=utf-8;')}
        >
          Download CSV Sample
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => downloadTextFile(SAMPLE_JSON, 'flashcard_sample.json', 'application/json')}
        >
          Download JSON Sample
        </Button>
      </Space>

      <div style={{ padding: 16, borderRadius: 8 }} className="border">
        <Title level={5}>CSV Example:</Title>
        <pre style={{ margin: 0, fontSize: 12 }}>{CSV_EXAMPLE}</pre>
      </div>

      <div style={{ padding: 16, borderRadius: 8 }} className="border">
        <Title level={5}>JSON Example:</Title>
        <pre style={{ margin: 0, fontSize: 12 }}>{JSON_EXAMPLE}</pre>
      </div>
    </Space>
  )

  const tabs = (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={[
        { key: 'upload', label: 'Upload File', children: uploadTab },
        { key: 'sample', label: 'Download Sample', children: sampleTab },
      ]}
    />
  )

  const actions = (
    <Space>
      <Button onClick={handleClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        type="primary"
        htmlType={mode === 'create' ? 'submit' : 'button'}
        loading={loading}
        disabled={!fileContent || exceedsLimit}
        onClick={mode === 'create' ? undefined : () => handleImport()}
      >
        Import
      </Button>
    </Space>
  )

  return (
    <Modal
      title={mode === 'create' ? 'Import Flashcard from File' : 'Import Terms to Flashcard'}
      open={open}
      onCancel={handleClose}
      width={700}
      footer={mode === 'append' ? actions : null}
      maskClosable={!loading}
      closable={!loading}
    >
      {mode === 'create' ? (
        <Form form={form} layout="vertical" onFinish={handleImport} style={{ marginTop: 16 }}>
          <Form.Item
            label="Flashcard Title"
            name="title"
            rules={[
              { required: true, message: 'Please input title!' },
              { min: 3, message: 'Title must be at least 3 characters' },
              { max: 200, message: 'Title must not exceed 200 characters' },
            ]}
          >
            <Input placeholder="Enter flashcard title" />
          </Form.Item>

          <Form.Item
            label="Description (optional)"
            name="description"
            rules={[{ max: 1000, message: 'Description must not exceed 1000 characters' }]}
          >
            <TextArea placeholder="Enter flashcard description" rows={2} />
          </Form.Item>

          {tabs}

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>{actions}</Form.Item>
        </Form>
      ) : (
        <div style={{ marginTop: 16 }}>{tabs}</div>
      )}
    </Modal>
  )
}

export default ImportTermsModal
