import axios from '../axios'
import {
  AnswerResult,
  FlashCard,
  FlashCardPaginationResponse,
  FlashCardsResponse,
  ITerm,
  LearnQuestion,
  LearnSessionStats,
} from '@/src/app/section/Notes/types'

export interface CreateFlashCardData {
  title: string
  description?: string
  terms: ITerm[]
}

export interface UpdateFlashCardData {
  title?: string
  description?: string
  terms?: ITerm[]
}

export interface GetFlashCardsParams {
  page?: number
  limit?: number
  search?: string
  createdBy?: string
}

export interface StartLearnSessionResponse {
  sessionId: string
  totalChunks: number
  currentChunkIndex: number
  completed: boolean
}

export interface SubmitAnswerPayload {
  answer: string
  startTime: number
}

export interface ImportFlashCardData {
  title: string
  description?: string
  fileContent: string
  fileType: 'csv' | 'json' | 'xlsx'
}

export type TermMatchMode = 'exact' | 'partial' | 'fuzzy'

export interface SearchFlashCardsParams {
  query: string
  page?: number
  limit?: number
  searchIn?: 'all' | 'title' | 'term' | 'definition'
}

export interface SearchFlashCardsResponse {
  query: string
  searchIn: string
  results: Array<FlashCard & { matchedTerms?: ITerm[]; totalMatchedTerms: number }>
  pagination: FlashCardPaginationResponse
  message: string
}

export interface SearchWithinFlashCardResponse {
  flashcard: { _id: string; title: string; description?: string; totalTerms: number }
  query: string
  matchMode: TermMatchMode
  matchedTerms: Array<ITerm & { index: number; matchScore: number }>
  totalMatches: number
  message: string
}

export const flashcardApi = {
  // Get all flashcards
  getFlashCards: async (params?: GetFlashCardsParams): Promise<FlashCardsResponse> => {
    const response = await axios.get<FlashCardsResponse>('/flashcards', { params })
    return response.data
  },

  // Get current user's flashcards
  getMyFlashCards: async (params?: { page?: number; limit?: number }): Promise<FlashCardsResponse> => {
    const response = await axios.get<FlashCardsResponse>('/flashcards/my', { params })
    return response.data
  },

  // Get single flashcard by ID
  getFlashCardById: async (id: string): Promise<{ flashcard: FlashCard }> => {
    const response = await axios.get<{ flashcard: FlashCard }>(`/flashcards/${id}`)
    return response.data
  },

  // Create new flashcard
  createFlashCard: async (data: CreateFlashCardData): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard }>('/flashcards', data)
    return response.data
  },

  // Update flashcard
  updateFlashCard: async (
    id: string,
    data: UpdateFlashCardData,
  ): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.put<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}`, data)
    return response.data
  },

  // Delete flashcard
  deleteFlashCard: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`/flashcards/${id}`)
    return response.data
  },

  // Add term to flashcard
  addTerm: async (id: string, term: ITerm): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}/terms`, term)
    return response.data
  },

  // Update specific term
  updateTerm: async (
    id: string,
    termIndex: number,
    term: Partial<ITerm>,
  ): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.put<{ message: string; flashcard: FlashCard }>(
      `/flashcards/${id}/terms/${termIndex}`,
      term,
    )
    return response.data
  },

  // Delete specific term
  deleteTerm: async (id: string, termIndex: number): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.delete<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}/terms/${termIndex}`)
    return response.data
  },

  // Global search across flashcards
  searchFlashcards: async (params: SearchFlashCardsParams): Promise<SearchFlashCardsResponse> => {
    const { query, ...rest } = params
    const response = await axios.get<SearchFlashCardsResponse>('/flashcards/search', {
      params: { q: query, searchIn: 'all', ...rest },
    })
    return response.data
  },

  // Search within the terms of one flashcard
  searchWithinFlashcard: async (
    flashcardId: string,
    query: string,
    matchMode: TermMatchMode = 'partial',
  ): Promise<SearchWithinFlashCardResponse> => {
    const response = await axios.get<SearchWithinFlashCardResponse>(
      `/flashcards/${flashcardId}/search`,
      { params: { q: query, matchMode } },
    )
    return response.data
  },

  // Import flashcards from file
  importFlashCards: async (data: ImportFlashCardData): Promise<{ message: string; flashcard: FlashCard; importedCount: number }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard; importedCount: number }>('/flashcards/import', data)
    return response.data
  },

  // Import terms into existing flashcard
  importTerms: async (flashcardId: string, data: Omit<ImportFlashCardData, 'title' | 'description'>): Promise<{ message: string; flashcard: FlashCard; importedCount: number; totalTerms: number }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard; importedCount: number; totalTerms: number }>(`/flashcards/${flashcardId}/import-terms`, data)
    return response.data
  },
}

// learn
export const learnApi = {
  // Start learning session
  start: async (flashcardId: string): Promise<StartLearnSessionResponse> => {
    const response = await axios.post<StartLearnSessionResponse>(`/learn/${flashcardId}/start`)
    return response.data
  },

  // Get next question in learning session
  getQuestion: async (sessionId: string): Promise<LearnQuestion | null> => {
    try {
      const response = await axios.get<LearnQuestion>(`/learn/${sessionId}/question`)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 204) {
        return null
      }
      throw error
    }
  },

  // Submit answer to a question
  submitAnswer: async (
    sessionId: string,
    payload: SubmitAnswerPayload,
  ): Promise<AnswerResult> => {
    const response = await axios.post<AnswerResult>(
      `/learn/${sessionId}/answer`,
      payload,
    )
    return response.data
  },

  // Get learning session statistics
  getStats: async (sessionId: string): Promise<LearnSessionStats> => {
    const response = await axios.get<LearnSessionStats>(`/learn/${sessionId}/stats`)
    return response.data
  },

  // Reset learning session
  reset: async (flashcardId: string): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`/learn/${flashcardId}/reset`)
    return response.data
  },
};

