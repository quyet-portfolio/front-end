export interface ITag {
  term: string;
  definition: string;
  related?: string;
}

export interface FlashCard {
  _id: string;
  title: string;
  description?: string;
  tags: ITag[];
  createdBy: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FlashCardPaginationResponse {
  currentPage: number;
  totalPages: number;
  totalFlashCards: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FlashCardsResponse {
  flashcards: FlashCard[];
  pagination: FlashCardPaginationResponse;
}

// learn.types.ts
export type LearnState =
  | "idle"
  | "loading"
  | "question"
  | "feedback"
  | "completed"
  | "error";

export type LearnPhase = "learn" | "review";

export interface LearnQuestion {
  tagIndex: number;
  phase: LearnPhase;
  prompt: string;
}

export interface AnswerResult {
  correct: boolean;
  stepCount: number;
  totalSteps: number;
  phase: LearnPhase;
  completed: boolean;
}

