'use client'

import { useState, useEffect } from 'react'
import { FlashCard, FlashCardPaginationResponse } from '../types'
import { flashcardApi, GetFlashCardsParams } from '@/src/lib/api/notes'

export const useFlashCards = (params?: GetFlashCardsParams) => {
  const [flashcards, setFlashCards] = useState<FlashCard[]>([])
  const [pagination, setPagination] = useState<FlashCardPaginationResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFlashCards = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await flashcardApi.getFlashCards(params)
      setFlashCards(data.flashcards)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch flashcards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlashCards()
  }, [JSON.stringify(params)])

  return { flashcards, pagination, loading, error, refetch: fetchFlashCards }
}
