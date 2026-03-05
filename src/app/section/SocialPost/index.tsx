'use client'

import { Button, Input, Card, Spin } from 'antd'
import React, { useState } from 'react'
import { socialApi, GenerateSocialPostResponse } from '../../../lib/api/social'
import { useMessageApi } from '../../../contexts/MessageContext'

const { TextArea } = Input

const SocialPostView = () => {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateSocialPostResponse | null>(null)
  const messageApi = useMessageApi()

  const handleGenerate = async () => {
    if (!topic.trim()) {
      messageApi?.error('Vui lòng nhập chủ đề')
      return
    }

    try {
      setLoading(true)
      setResult(null)
      const data = await socialApi.generatePost({ topic })
      setResult(data)
      messageApi?.success('Tạo bài Nhậpđăng thành công!')
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo bài đăng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 px-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Creat post Facebook</h1>
      
      <div className="w-full flex gap-4 mb-6">
        <Input
          placeholder="Enter some idea..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onPressEnter={handleGenerate}
          disabled={loading}
          size="large"
        />
        <Button 
          type="primary" 
          onClick={handleGenerate}
          loading={loading}
          size="large"
        >
          Generate
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-10">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Generating...</p>
        </div>
      )}

      <Button onClick={() => {
        window.open("https://www.facebook.com/healthylife098/")
      }}>View page now</Button>

      {/* {result && (
        <Card className="w-full" title="Kết quả">
          <div className="mb-4">
            <label className="font-semibold block mb-2">Caption:</label>
            <TextArea
              value={result.caption}
              readOnly
              rows={6}
              className="bg-gray-50"
            />
          </div>
          
          {result.image && (
            <div>
              <label className="font-semibold block mb-2">Hình ảnh:</label>
              <img 
                src={result.image} 
                alt="Generated" 
                className="max-w-full rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}
        </Card>
      )} */}
    </div>
  )
}

export default SocialPostView
