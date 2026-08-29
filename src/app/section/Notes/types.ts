export interface ITerm {
  term: string;
  definition: string;
  related?: string;
}

export interface FlashCard {
  _id: string;
  title: string;
  description?: string;
  terms: ITerm[];
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
  termId: string;
  flashcardId: string; // For redirect after completion
  phase: LearnPhase;
  stepCount: number;
  totalSteps: number;
  prompt: string;
  /** Rỗng ở phase review — lúc đó người học gõ tay chứ không chọn đáp án. */
  quizOptions: string[];
  progress: LearnProgress;
}

export interface AnswerResult {
  correct: boolean;
  /** User bấm "I don't know" — không phải trả lời sai. */
  skipped: boolean;
  correctAnswer: string;
  stepCount: number;
  totalSteps: number;
  phase: LearnPhase;
  completed: boolean;
  chunkCompleted: boolean;
  progress: LearnProgress;
}

/** Độ thuộc dài hạn của một bộ thẻ, tích luỹ qua nhiều phiên học. */
export interface MasterySummary {
  totalTerms: number;
  /** Đã đạt ngưỡng thuộc. */
  mastered: number;
  /** Đã học nhưng chưa tới ngưỡng. */
  learning: number;
  /** Chưa từng gặp trong phiên học nào. */
  notStarted: number;
  /** Tới hạn ôn lại. */
  dueForReview: number;
  masteryPercentage: number;
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
    skipped: number;
  };
  mastery: MasterySummary;
}
