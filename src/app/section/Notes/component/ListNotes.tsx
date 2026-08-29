'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFlashCards } from '../hook/useFlashCards'
import { useAuth } from '@/src/contexts/AuthContext'
import { useState } from 'react'
import { Avatar, Button, Empty, Modal, Pagination, Spin, Tag } from 'antd'
import { BookOutlined, UserOutlined } from '@ant-design/icons'
import { useFlashCardsStore } from '../store'
import { useDebounce } from '@/src/hooks/useDebounce'
import { motion } from 'framer-motion'
import { FlashCard } from '../types'

/**
 * Thẻ trong danh sách là một <Link> chứ không phải <div onClick>.
 *
 * Cái div cũ không tab tới được, không mở tab mới bằng ctrl/cmd-click được, và
 * với crawler thì trang chi tiết coi như không tồn tại vì chẳng có <a> nào trỏ tới.
 */
const FlashCardItem = ({ item }: { item: FlashCard }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
    <Link
      href={`/notes/${item._id}`}
      className="group relative p-5 rounded-xl min-h-[160px] flex flex-col justify-between overflow-hidden
        bg-gradient-to-br from-[#0d1433] to-[#0a0f24]
        border border-white/5 hover:border-indigo-500/60
        shadow-sm hover:shadow-indigo-900/30 hover:shadow-lg
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f24]"
    >
      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-b-xl" />

      <div className="flex flex-col gap-2">
        {/* Title */}
        <p className="text-base font-semibold text-white leading-snug line-clamp-2">{item.title}</p>
        {/* Term count */}
        <div className="flex items-center gap-1.5">
          <BookOutlined className="text-indigo-400 text-xs" />
          <Tag color="geekblue" className="text-xs">
            {item?.terms?.length} term{item?.terms?.length !== 1 ? 's' : ''}
          </Tag>
        </div>
      </div>

      {/* Footer: author */}
      <div className="flex items-center gap-2 mt-3">
        <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#6366F1' }} />
        <span className="text-xs text-gray-400 truncate">{item?.createdBy?.username}</span>
      </div>
    </Link>
  </motion.div>
)

const ListNotes = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const page = useFlashCardsStore((s) => s.page)
  const limit = useFlashCardsStore((s) => s.limit)
  const search = useFlashCardsStore((s) => s.search)
  const createdBy = useFlashCardsStore((s) => s.createdBy)
  const refreshToken = useFlashCardsStore((s) => s.refreshToken)
  const setPage = useFlashCardsStore((s) => s.setPage)
  const setSearch = useFlashCardsStore((s) => s.setSearch)

  const debouncedSearch = useDebounce(search, 500)

  const { flashcards, pagination, loading } = useFlashCards({
    page,
    limit,
    createdBy,
    search: debouncedSearch,
    refreshToken,
  })

  const [isOpenPopupAuthen, setOpenPopupAuthen] = useState(false)

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setOpenPopupAuthen(true)
      return
    }
    router.push('/notes/create')
  }

  const isSearching = Boolean(debouncedSearch)

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
        // Không tìm ra kết quả khác hẳn với chưa có note nào — mời người đang tìm
        // kiếm "tạo note mới" là trả lời lệch câu hỏi họ vừa đặt.
        isSearching ? (
          <Empty description={`No notes match "${debouncedSearch}"`}>
            <Button onClick={() => setSearch('')}>Clear search</Button>
          </Empty>
        ) : (
          <Empty description="No note here">
            <Button type="primary" onClick={handleCreateClick}>
              Create a note now
            </Button>
          </Empty>
        )
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flashcards.map((item) => (
              <FlashCardItem key={item._id} item={item} />
            ))}
          </div>

          {/*
            Không có phân trang thì note thứ 11 trở đi không có cách nào mở được:
            server vẫn trả về `pagination` đầy đủ nhưng UI chưa từng dùng tới.
          */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.currentPage}
                total={pagination.totalFlashCards}
                pageSize={limit}
                showSizeChanger={false}
                onChange={(nextPage) => {
                  setPage(nextPage)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </>
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
