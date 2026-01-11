'use client'

import { useRouter } from 'next/navigation'
import { dataNotes } from '../../data/notes'
import { useFlashCards } from './hook/useFlashCards'
import { useAuth } from '@/src/contexts/AuthContext'
import { useState } from 'react'
import { Avatar, Spin } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import Image from 'next/image'
import { useFlashCardsStore } from './store'
import { useDebounce } from '@/src/hooks/useDebounce'
import { div } from 'framer-motion/client'

const NotesList = () => {
  const router = useRouter()
  const { user } = useAuth()
  // const [page, setPage] = useState(1)

  const paramsGetFlashCards = useFlashCardsStore((state) => state)

  const debouncedValue = useDebounce(paramsGetFlashCards.search, 500)

  const { flashcards, pagination, loading, refetch } = useFlashCards({
    ...paramsGetFlashCards,
    search: debouncedValue,
  })

  return (
    <div className="mt-4 w-full h-full">
      {loading ? (
        <div className="flex flex-col justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {flashcards.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                router.push(`/notes/${item?._id}`)
              }}
              className="p-4 rounded-md min-h-[150px] bg-[#0a0f24] border-b-4 hover:border-b-[#6366F1] flex flex-col justify-between cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold">{item.title}</p>
                <div>
                  {item?.tags?.length} Item{item?.tags?.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {item?.createdBy?.avatar ? (
                    <Image src={''} alt="avatar-user" width={16} height={16} />
                  ) : (
                    <Avatar size="small" icon={<UserOutlined />} />
                  )}
                  {item?.createdBy?.username}{' '}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotesList
