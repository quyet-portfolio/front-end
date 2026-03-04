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

export interface LearnProgress {
  currentChunk: number;
  totalChunks: number;
  completedTerms: number;
  totalTerms: number;
  percentage: number;
}

export interface LearnQuestion {
  tagIndex: number;
  flashcardId: string; // For redirect after completion
  phase: LearnPhase;
  prompt: string;
  quizOptions: string[];
  // correctAnswer removed from question - only revealed in feedback after answering
  progress: LearnProgress;
  serverTime: number;
}

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  stepCount: number;
  totalSteps: number;
  phase: LearnPhase;
  completed: boolean;
  chunkCompleted: boolean;
  progress: LearnProgress;
}

export interface LearnSessionStats {
  session: {
    completed: boolean;
    currentChunk: number;
    totalChunks: number;
  };
  stats: {
    totalQuestions: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    avgResponseTimeMs: number;
  };
}
