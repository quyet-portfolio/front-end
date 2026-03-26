'use client'

import { useRouter } from 'next/navigation'
import { useFlashCards } from '../hook/useFlashCards'
import { useAuth } from '@/src/contexts/AuthContext'
import { useState } from 'react'
import { Avatar, Button, Empty, Modal, Spin, Tag } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useFlashCardsStore } from '../store'
import { useDebounce } from '@/src/hooks/useDebounce'
import { motion } from 'framer-motion'
import { FlashCard } from '../types'

const FlashCardItem = ({ item, onClick }: { item: FlashCard; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    onClick={onClick}
    className="group relative p-5 rounded-xl min-h-[160px] flex flex-col justify-between cursor-pointer overflow-hidden
      bg-gradient-to-br from-[#0d1433] to-[#0a0f24]
      border border-white/5 hover:border-indigo-500/60
      shadow-sm hover:shadow-indigo-900/30 hover:shadow-lg
      transition-all duration-300"
  >
    {/* Decorative accent line */}
    <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-b-xl" />

    <div className="flex flex-col gap-2">
      {/* Title */}
      <p className="text-base font-semibold text-white leading-snug line-clamp-2">
        {item.title}
      </p>
      {/* Tag count */}
      <div className="flex items-center gap-1.5">
        <BookOutlined className="text-indigo-400 text-xs" />
        <Tag color="geekblue" className="text-xs">
          {item?.tags?.length} term{item?.tags?.length !== 1 ? 's' : ''}
        </Tag>
      </div>
    </div>

    {/* Footer: author */}
    <div className="flex items-center gap-2 mt-3">
      <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#6366F1' }} />
      <span className="text-xs text-gray-400 truncate">{item?.createdBy?.username}</span>
    </div>
  </motion.div>
)

const ListNotes = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const paramsGetFlashCards = useFlashCardsStore((state) => state)
  const debouncedValue = useDebounce(paramsGetFlashCards.search, 500)

  const { flashcards, loading } = useFlashCards({
    ...paramsGetFlashCards,
    search: debouncedValue,
  })

  const [isOpenPopupAuthen, setOpenPopupAuthen] = useState(false)

  const handleCardClick = (id: string) => {
    router.push(`/notes/${id}`)
  }

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setOpenPopupAuthen(true)
      return
    }
    router.push('/notes/create')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="mt-4 w-full h-full">
      {flashcards.length === 0 ? (
        <Empty description="No note here">
          <Button type="primary" onClick={handleCreateClick}>
            Create a note now
          </Button>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flashcards.map((item) => (
            <FlashCardItem
              key={item._id}
              item={item}
              onClick={() => handleCardClick(item._id)}
            />
          ))}
        </div>
      )}

      <Modal
        title="Access denied"
        open={isOpenPopupAuthen}
        centered
        closable={false}
        footer={
          <div className="flex justify-end gap-4">
            <Button onClick={() => setOpenPopupAuthen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => router.push('/login')}>
              Log in now
            </Button>
          </div>
        }
      >
        Log in to create a note.
      </Modal>
    </div>
  )
}

export default ListNotes
