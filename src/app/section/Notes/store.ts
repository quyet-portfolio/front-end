import { GetFlashCardsParams, learnApi } from "@/src/lib/api/notes";
import { create } from "zustand";
import { AnswerResult, LearnQuestion, LearnProgress, LearnState } from "./types";

interface LearnStore {
  // ===== STATE =====
  sessionId: string | null;
  state: LearnState;

  question: LearnQuestion | null;
  result: AnswerResult | null;

  // Progress tracking
  stepCount: number;
  totalSteps: number;
  phase: "learn" | "review";
  progress: LearnProgress | null;
  
  // For tracking response time
  questionStartTime: number;
  
  // For handling auto-next timeout
  autoNextTimeoutId: ReturnType<typeof setTimeout> | null;

  error?: string;

  // ===== ACTIONS =====
  start: (flashcardId: string) => Promise<void>;
  loadQuestion: () => Promise<void>;
  submit: (answer: string) => Promise<void>;
  next: () => Promise<void>;
  reset: () => void;
  clearAutoNext: () => void;
}

export const useFlashCardsStore = create<GetFlashCardsParams>( () => ({
    page: 1,
    limit: 10,
    search: undefined,
    createdBy: undefined
}))

export const useLearnStore = create<LearnStore>((set, get) => ({
  // ===== INITIAL =====
  sessionId: null,
  state: "idle",

  question: null,
  result: null,

  stepCount: 0,
  totalSteps: 0,
  phase: "learn",
  progress: null,
  questionStartTime: 0,
  autoNextTimeoutId: null,

  error: undefined,

  // ===== ACTIONS =====

  /**
   * Start / Resume Learn Session
   */
  start: async (flashcardId) => {
    set({ state: "loading", error: undefined });

    try {
      const { sessionId } = await learnApi.start(flashcardId);

      set({
        sessionId,
        result: null,
        stepCount: 0,
        totalSteps: 0,
        phase: "learn",
        progress: null,
        questionStartTime: 0,
        autoNextTimeoutId: null,
      });

      await get().loadQuestion();
    } catch {
      set({ state: "error", error: "Failed to start session" });
    }
  },

  /**
   * Load current question from BE
   * BE quyết định chunk + phase
   */
  loadQuestion: async () => {
    const { sessionId, autoNextTimeoutId } = get();
    if (!sessionId) return;

    // Clear any pending auto-next timeout
    if (autoNextTimeoutId) {
      clearTimeout(autoNextTimeoutId);
      set({ autoNextTimeoutId: null });
    }

    set({ state: "loading" });

    try {
      const question = await learnApi.getQuestion(sessionId);

      if (!question) {
        set({ state: "completed", question: null });
        return;
      }

      // Record start time for response time tracking
      const startTime = Date.now();
      
      set({
        question,
        state: "question",
        questionStartTime: startTime,
        progress: question.progress,
      });
    } catch {
      set({ state: "error", error: "Failed to load question" });
    }
  },

  /**
   * Submit answer with response time tracking
   */
  submit: async (answer) => {
    const { sessionId, state, questionStartTime, autoNextTimeoutId } = get();
    if (!sessionId || state !== "question") return;

    // Clear any existing auto-next timeout before submitting
    if (autoNextTimeoutId) {
      clearTimeout(autoNextTimeoutId);
    }

    try {
      const result: AnswerResult = await learnApi.submitAnswer(sessionId, {
        answer,
        startTime: questionStartTime,
      });

      set({
        result,
        state: "feedback",
        stepCount: result.stepCount,
        totalSteps: result.totalSteps,
        phase: result.phase,
        progress: result.progress,
        autoNextTimeoutId: null,
      });

      // Auto-advance after 2 seconds if correct
      if (result.correct && !result.completed) {
        const timeoutId = setTimeout(() => {
          // Only auto-advance if still in feedback state with same result
          const currentState = get();
          if (currentState.state === "feedback" && currentState.result?.correct) {
            get().loadQuestion();
          }
        }, 2000);
        
        set({ autoNextTimeoutId: timeoutId });
      }

    } catch {
      set({ state: "error", error: "Submit failed", autoNextTimeoutId: null });
    }
  },

  /**
   * Move forward after feedback (manual next)
   */
  next: async () => {
    const { result, autoNextTimeoutId } = get();
    if (!result) return;

    // Clear auto-next timeout if user manually clicks next
    if (autoNextTimeoutId) {
      clearTimeout(autoNextTimeoutId);
      set({ autoNextTimeoutId: null });
    }

    if (result.completed) {
      set({ state: "completed", question: null, autoNextTimeoutId: null });
      return;
    }

    await get().loadQuestion();
  },
  
  /**
   * Clear auto-next timeout
   */
  clearAutoNext: () => {
    const { autoNextTimeoutId } = get();
    if (autoNextTimeoutId) {
      clearTimeout(autoNextTimeoutId);
      set({ autoNextTimeoutId: null });
    }
  },

  /**
   * Reset toàn bộ Learn state
   */
  reset: () => {
    const { autoNextTimeoutId } = get();
    if (autoNextTimeoutId) {
      clearTimeout(autoNextTimeoutId);
    }
    
    set({
      sessionId: null,
      question: null,
      result: null,
      stepCount: 0,
      totalSteps: 0,
      phase: "learn",
      progress: null,
      questionStartTime: 0,
      autoNextTimeoutId: null,
      error: undefined,
    });
  },
}));
