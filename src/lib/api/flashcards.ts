import axios from '../axios'
import {
  AnswerResult,
  Flashcard,
  FlashcardPaginationResponse,
  FlashcardsResponse,
  ITerm,
  LearnQuestion,
  LearnSessionStats,
  MasterySummary,
} from '@/src/app/section/Flashcards/types'

export interface CreateFlashcardData {
  title: string
  description?: string
  terms: ITerm[]
}

export interface UpdateFlashcardData {
  title?: string
  description?: string
  terms?: ITerm[]
}

export interface GetFlashcardsParams {
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
  /** Bỏ trống khi `skipped` = true. */
  answer?: string
  /** User bấm "I don't know" — server cho qua term này thay vì hỏi lại mãi. */
  skipped?: boolean
  /**
   * Thời gian đã trôi kể từ lúc câu hỏi hiện ra, tính bằng ms.
   *
   * Gửi KHOẢNG thời gian chứ không phải mốc `Date.now()` của client: server trừ
   * bằng đồng hồ của nó, nên lệch giờ giữa hai máy là đủ để ra số âm.
   */
  elapsedMs: number
}

export interface ImportFlashcardData {
  title: string
  description?: string
  fileContent: string
  fileType: 'csv' | 'json' | 'xlsx'
}

export type TermMatchMode = 'exact' | 'partial' | 'fuzzy'

export interface SearchFlashcardsParams {
  query: string
  page?: number
  limit?: number
  searchIn?: 'all' | 'title' | 'term' | 'definition'
}

export interface SearchFlashcardsResponse {
  query: string
  searchIn: string
  results: Array<Flashcard & { matchedTerms?: ITerm[]; totalMatchedTerms: number }>
  pagination: FlashcardPaginationResponse
  message: string
}

export interface SearchWithinFlashcardResponse {
  flashcard: { _id: string; title: string; description?: string; totalTerms: number }
  query: string
  matchMode: TermMatchMode
  matchedTerms: Array<ITerm & { index: number; matchScore: number }>
  totalMatches: number
  message: string
}

export const flashcardApi = {
  // Get all flashcards. `signal` để huỷ request cũ khi tham số đổi giữa chừng.
  getFlashcards: async (
    params?: GetFlashcardsParams,
    signal?: AbortSignal,
  ): Promise<FlashcardsResponse> => {
    const response = await axios.get<FlashcardsResponse>('/flashcards', { params, signal })
    return response.data
  },

  // Get current user's flashcards
  getMyFlashcards: async (params?: { page?: number; limit?: number }): Promise<FlashcardsResponse> => {
    const response = await axios.get<FlashcardsResponse>('/flashcards/my', { params })
    return response.data
  },

  // Get single flashcard by ID
  getFlashcardById: async (id: string): Promise<{ flashcard: Flashcard }> => {
    const response = await axios.get<{ flashcard: Flashcard }>(`/flashcards/${id}`)
    return response.data
  },

  // Create new flashcard
  createFlashcard: async (data: CreateFlashcardData): Promise<{ message: string; flashcard: Flashcard }> => {
    const response = await axios.post<{ message: string; flashcard: Flashcard }>('/flashcards', data)
    return response.data
  },

  // Update flashcard
  updateFlashcard: async (
    id: string,
    data: UpdateFlashcardData,
  ): Promise<{ message: string; flashcard: Flashcard }> => {
    const response = await axios.put<{ message: string; flashcard: Flashcard }>(`/flashcards/${id}`, data)
    return response.data
  },

  // Delete flashcard
  deleteFlashcard: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`/flashcards/${id}`)
    return response.data
  },

  // Add term to flashcard
  addTerm: async (id: string, term: ITerm): Promise<{ message: string; flashcard: Flashcard }> => {
    const response = await axios.post<{ message: string; flashcard: Flashcard }>(`/flashcards/${id}/terms`, term)
    return response.data
  },

  // Update specific term
  updateTerm: async (
    id: string,
    termIndex: number,
    term: Partial<ITerm>,
  ): Promise<{ message: string; flashcard: Flashcard }> => {
    const response = await axios.put<{ message: string; flashcard: Flashcard }>(
      `/flashcards/${id}/terms/${termIndex}`,
      term,
    )
    return response.data
  },

  // Delete specific term
  deleteTerm: async (id: string, termIndex: number): Promise<{ message: string; flashcard: Flashcard }> => {
    const response = await axios.delete<{ message: string; flashcard: Flashcard }>(`/flashcards/${id}/terms/${termIndex}`)
    return response.data
  },

  // Global search across flashcards
  searchFlashcards: async (params: SearchFlashcardsParams): Promise<SearchFlashcardsResponse> => {
    const { query, ...rest } = params
    const response = await axios.get<SearchFlashcardsResponse>('/flashcards/search', {
      params: { q: query, searchIn: 'all', ...rest },
    })
    return response.data
  },

  // Search within the terms of one flashcard
  searchWithinFlashcard: async (
    flashcardId: string,
    query: string,
    matchMode: TermMatchMode = 'partial',
  ): Promise<SearchWithinFlashcardResponse> => {
    const response = await axios.get<SearchWithinFlashcardResponse>(
      `/flashcards/${flashcardId}/search`,
      { params: { q: query, matchMode } },
    )
    return response.data
  },

  // Import flashcards from file
  importFlashcards: async (data: ImportFlashcardData): Promise<{ message: string; flashcard: Flashcard; importedCount: number }> => {
    const response = await axios.post<{ message: string; flashcard: Flashcard; importedCount: number }>('/flashcards/import', data)
    return response.data
  },

  // Import terms into existing flashcard
  importTerms: async (flashcardId: string, data: Omit<ImportFlashcardData, 'title' | 'description'>): Promise<{ message: string; flashcard: Flashcard; importedCount: number; totalTerms: number }> => {
    const response = await axios.post<{ message: string; flashcard: Flashcard; importedCount: number; totalTerms: number }>(`/flashcards/${flashcardId}/import-terms`, data)
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

  // Get next question in learning session — null nghĩa là session đã xong.
  getQuestion: async (sessionId: string): Promise<LearnQuestion | null> => {
    // 204 là response THÀNH CÔNG, axios không ném lỗi. Bắt nó ở khối catch như
    // trước là nhánh chết; luồng chỉ chạy đúng nhờ `response.data` rỗng là falsy.
    const response = await axios.get<LearnQuestion>(`/learn/${sessionId}/question`)
    return response.status === 204 ? null : response.data
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

  // Độ thuộc của bộ thẻ — không cần session, dùng cho trang chi tiết.
  getMastery: async (flashcardId: string): Promise<{ mastery: MasterySummary }> => {
    const response = await axios.get<{ mastery: MasterySummary }>(`/learn/${flashcardId}/mastery`)
    return response.data
  },

  // Reset learning session
  reset: async (flashcardId: string): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`/learn/${flashcardId}/reset`)
    return response.data
  },
};

