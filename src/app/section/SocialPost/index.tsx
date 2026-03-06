'use client'

import { Button, Input, Card, Spin, Image, Space, Tag, Modal, Select } from 'antd'
import React, { useState, useEffect } from 'react'
import { socialApi, Post } from '../../../lib/api/social'
import { useMessageApi } from '../../../contexts/MessageContext'
import { EditOutlined, CheckOutlined, CopyOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons'

const { TextArea } = Input
const { Option } = Select

const SocialPostView = () => {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ caption: '', image: '', platform: 'facebook' })
  const messageApi = useMessageApi()

  // Load danh sách posts khi mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await socialApi.getPosts('pending_review')
      setPosts(data.data)
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      messageApi?.error('Vui lòng nhập chủ đề')
      return
    }

    try {
      setLoading(true)
      await socialApi.generatePost({ topic })
      messageApi?.success('Tạo bài đăng thành công! Vui lòng review.')
      fetchPosts() // Refresh list
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo bài đăng')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedPost) return

    try {
      await socialApi.updatePost(selectedPost.postId, {
        caption: editForm.caption,
        image: editForm.image,
        platform: editForm.platform,
      })
      messageApi?.success('Đã lưu chỉnh sửa!')
      setIsEditModalOpen(false)
      fetchPosts()
    } catch (err: any) {
      messageApi?.error(err.response?.data?.message || 'Lỗi khi lưu')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'gold'
      case 'approved':
        return 'blue'
      case 'posted':
        return 'green'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_review':
        return 'Chờ review'
      case 'approved':
        return 'Đã duyệt'
      case 'posted':
        return 'Đã đăng'
      default:
        return status
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Facebook Post</h1>

      {/* Input tạo bài */}
      <div className="w-full flex gap-4 mb-6">
        <Input
          placeholder="Enter topic idea..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onPressEnter={handleGenerate}
          disabled={loading}
          size="large"
        />
        <Button type="primary" onClick={handleGenerate} loading={loading} size="large" icon={<SendOutlined />}>
          Generate
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center py-10">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">AI creating caption và image...</p>
        </div>
      )}

      {/* Danh sách các bài đã tạo */}
      <Card className="w-full" title="📚 History">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Social Post not yet</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.postId}
                className="flex flex-col gap-4 p-3 border rounded-lg"
                onClick={() => {
                  setSelectedPost(post)
                  setEditForm({
                    caption: post.caption,
                    image: post.image,
                    platform: post.platform || 'facebook',
                  })
                }}
              >
                <div className="flex-1">
                  <div className='flex justify-between mb-3'>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[16px]">Your topic: {post.topic}</span>
                      <Tag color={getStatusColor(post.status)}>{getStatusText(post.status)}</Tag>
                    </div>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setIsEditModalOpen(true)
                        setSelectedPost(post)
                        setEditForm({
                          caption: post.caption,
                          image: post.image,
                          platform: post.platform || 'facebook',
                        })
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm">{post.caption}</p>
                </div>
                <Image alt="" className='rounded' src={post.image} width={500} height={500} />
                <div className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Edit */}
      <Modal
        title="Edit post"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        width={700}
      >
        <Space direction="vertical" className="w-full" size="middle">
          <div>
            <label className="font-semibold block mb-2">Platform:</label>
            <Select
              value={editForm.platform}
              onChange={(value) => setEditForm({ ...editForm, platform: value })}
              className="w-full"
            >
              <Option value="facebook">Facebook</Option>
              <Option value="instagram">Instagram</Option>
              <Option value="twitter">Twitter</Option>
              <Option value="linkedin">LinkedIn</Option>
            </Select>
          </div>

          <div>
            <label className="font-semibold block mb-2">Caption:</label>
            <TextArea
              value={editForm.caption}
              onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
              rows={8}
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Image URL:</label>
            <Input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
            {editForm.image && (
              <Image src={editForm.image} alt="Preview" className="mt-2 max-h-48 object-cover rounded" />
            )}
          </div>
        </Space>
      </Modal>

      <Button className="mt-6" onClick={() => window.open('https://www.facebook.com/healthylife098/')}>
        View Facebook Page
      </Button>
    </div>
  )
}

export default SocialPostView
