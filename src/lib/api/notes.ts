
import axios from '../axios';
import { FlashCard, FlashCardsResponse, ITag } from '@/src/app/section/Notes/types';

export interface CreateFlashCardData {
  title: string;
  description?: string;
  tags: ITag[];
}

export interface UpdateFlashCardData {
  title?: string;
  description?: string;
  tags?: ITag[];
}

export interface GetFlashCardsParams {
  page?: number;
  limit?: number;
  search?: string;
  createdBy?: string;
}

export const flashcardApi = {
  // Get all flashcards
  getFlashCards: async (params?: GetFlashCardsParams): Promise<FlashCardsResponse> => {
    const response = await axios.get<FlashCardsResponse>('/flashcards', { params });
    return response.data;
  },

  // Get current user's flashcards
  getMyFlashCards: async (params?: { page?: number; limit?: number }): Promise<FlashCardsResponse> => {
    const response = await axios.get<FlashCardsResponse>('/flashcards/my', { params });
    return response.data;
  },

  // Get single flashcard by ID
  getFlashCardById: async (id: string): Promise<{ flashcard: FlashCard }> => {
    const response = await axios.get<{ flashcard: FlashCard }>(`/flashcards/${id}`);
    return response.data;
  },

  // Create new flashcard
  createFlashCard: async (data: CreateFlashCardData): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard }>('/flashcards', data);
    return response.data;
  },

  // Update flashcard
  updateFlashCard: async (id: string, data: UpdateFlashCardData): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.put<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}`, data);
    return response.data;
  },

  // Delete flashcard
  deleteFlashCard: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete<{ message: string }>(`/flashcards/${id}`);
    return response.data;
  },

  // Add tag to flashcard
  addTag: async (id: string, tag: ITag): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.post<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}/tags`, tag);
    return response.data;
  },

  // Update specific tag
  updateTag: async (id: string, tagIndex: number, tag: Partial<ITag>): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.put<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}/tags/${tagIndex}`, tag);
    return response.data;
  },

  // Delete specific tag
  deleteTag: async (id: string, tagIndex: number): Promise<{ message: string; flashcard: FlashCard }> => {
    const response = await axios.delete<{ message: string; flashcard: FlashCard }>(`/flashcards/${id}/tags/${tagIndex}`);
    return response.data;
  }
};