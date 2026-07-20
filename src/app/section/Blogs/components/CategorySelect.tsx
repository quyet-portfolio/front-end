'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from 'antd/es/button'
import Divider from 'antd/es/divider'
import Input from 'antd/es/input'
import Modal from 'antd/es/modal'
import Select from 'antd/es/select'
import Space from 'antd/es/space'
import Tooltip from 'antd/es/tooltip'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAuth } from '@/src/contexts/AuthContext'
import { useMessageApi } from '@/src/contexts/MessageContext'
import { categoryApi } from '@/src/lib/api/category'
import { Category } from '@/src/lib/types'

interface CategorySelectProps {
  // Do Form.Item của AntD truyền xuống
  value?: string
  onChange?: (value: string) => void
}

const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  const { user, isAdmin } = useAuth()
  const messageApi = useMessageApi()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  // Mỗi bài blog chỉ được tạo thêm tối đa 1 category — giữ lại để chặn nút Add
  const [createdInSession, setCreatedInSession] = useState<Category | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryApi.getCategories()
      setCategories(data.categories)
    } catch {
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const canDelete = (category: Category): boolean => {
    if (category.isDefault) return false
    return isAdmin || (!!user && category.createdBy === user._id)
  }

  const canRename = (category: Category): boolean => !category.isDefault && isAdmin

  const handleCreate = async () => {
    const name = newName.trim()
    if (!name) return

    try {
      setCreating(true)
      const data = await categoryApi.createCategory(name)
      setCategories((prev) => [...prev, data.category])
      setCreatedInSession(data.category)
      setNewName('')
      onChange?.(data.category.name)
      messageApi?.success('Đã tạo category mới')
    } catch (error: any) {
      messageApi?.error(error.response?.data?.message || 'Không tạo được category')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = (category: Category) => {
    Modal.confirm({
      title: `Xoá category "${category.name}"?`,
      content: 'Các bài blog đang dùng category này sẽ được chuyển sang "Other".',
      okText: 'Xoá',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          const data = await categoryApi.deleteCategory(category._id)
          setCategories((prev) => prev.filter((item) => item._id !== category._id))
          // Xoá category vừa tạo thì được tạo lại cái khác
          if (createdInSession?._id === category._id) setCreatedInSession(null)
          if (value === category.name) onChange?.('')
          messageApi?.success(
            data.movedBlogs > 0 ? `Đã xoá, ${data.movedBlogs} bài chuyển sang "Other"` : 'Đã xoá category'
          )
        } catch (error: any) {
          messageApi?.error(error.response?.data?.message || 'Không xoá được category')
        }
      },
    })
  }

  const handleRename = (category: Category) => {
    let nextName = category.name

    Modal.confirm({
      title: `Change category name "${category.name}"`,
      content: (
        <Input defaultValue={category.name} onChange={(e) => (nextName = e.target.value)} className="mt-3" />
      ),
      okText: 'Save',
      cancelText: 'Cancel',
      onOk: async () => {
        const name = nextName.trim()
        if (!name || name === category.name) return

        try {
          const data = await categoryApi.updateCategory(category._id, name)
          setCategories((prev) => prev.map((item) => (item._id === category._id ? data.category : item)))
          if (value === category.name) onChange?.(data.category.name)
          messageApi?.success('Category name updated successfully')
        } catch (error: any) {
          messageApi?.error(error.response?.data?.message || 'Failed to update category name')
          throw error
        }
      },
    })
  }

  const options = useMemo(
    () => categories.map((category) => ({ value: category.name, label: category.name, category })),
    [categories]
  )

  const isAddDisabled = !newName.trim() || !!createdInSession

  return (
    <Select
      value={value || undefined}
      onChange={onChange}
      loading={loading}
      showSearch
      placeholder="Select category"
      options={options}
      optionFilterProp="value"
      optionRender={({ data }) => {
        const category = (data as { category: Category }).category
        return (
          <div className="flex justify-between items-center gap-2">
            <span>{category.name}</span>
            <Space size={4} onClick={(e) => e.stopPropagation()}>
              {canRename(category) && (
                <EditOutlined
                  className="opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRename(category)
                  }}
                />
              )}
              {canDelete(category) && (
                <DeleteOutlined
                  className="text-red-500 opacity-60 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(category)
                  }}
                />
              )}
            </Space>
          </div>
        )
      }}
      popupRender={(menu) => (
        <>
          {menu}
          <Divider className="my-2" />
          <div className="flex gap-2 px-2 pb-2">
            <Input
              placeholder="Enter new category name"
              value={newName}
              maxLength={50}
              disabled={!!createdInSession}
              onChange={(e) => setNewName(e.target.value)}
              // Chặn phím lọt xuống Select (Enter/mũi tên/Backspace sẽ chọn hoặc xoá option)
              onKeyDown={(e) => e.stopPropagation()}
              onPressEnter={(e) => {
                e.preventDefault()
                if (!isAddDisabled) handleCreate()
              }}
            />
            <Tooltip title={createdInSession ? 'Each blog can only have one additional category' : ''}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                loading={creating}
                disabled={isAddDisabled}
                onClick={handleCreate}
              >
                Add
              </Button>
            </Tooltip>
          </div>
        </>
      )}
    />
  )
}

export default CategorySelect
