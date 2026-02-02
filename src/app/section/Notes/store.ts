import { GetFlashCardsParams, learnApi } from "@/src/lib/api/notes";
import { create } from "zustand";
import { AnswerResult, LearnQuestion, LearnState } from "./types";

interface LearnStore {
  // ===== STATE =====
  sessionId: string | null;
  state: LearnState;

  question: LearnQuestion | null;
  result: AnswerResult | null;

  // Progress (CHUNK LEVEL)
  stepCount: number;
  totalSteps: number;
  phase: "learn" | "review";

  error?: string;

  // ===== ACTIONS =====
  start: (flashcardId: string) => Promise<void>;
  loadQuestion: () => Promise<void>;
  submit: (answer: string) => Promise<void>;
  next: () => Promise<void>;
  reset: () => void;
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
    const { sessionId } = get();
    if (!sessionId) return;

    set({ state: "loading" });

    try {
      const question = await learnApi.getQuestion(sessionId);

      if (!question) {
        set({ state: "completed", question: null });
        return;
      }

      set({
        question,
        state: "question",
      });
    } catch {
      set({ state: "error", error: "Failed to load question" });
    }
  },

  /**
   * Submit answer
   * stepCount CHỈ update từ BE response
   */
  submit: async (answer) => {
    const { sessionId, state } = get();
    if (!sessionId || state !== "question") return;

    set({ state: "loading" });

    try {
      const result: AnswerResult = await learnApi.submitAnswer(sessionId, {
        answer,
      });

      set({
        result,
        stepCount: result.stepCount,
        totalSteps: result.totalSteps,
        phase: result.phase,
        state: "feedback",
      });
    } catch {
      set({ state: "error", error: "Submit failed" });
    }
  },

  /**
   * Move forward after feedback
   */
  next: async () => {
    const { result } = get();
    if (!result) return;

    if (result.completed) {
      set({ state: "completed", question: null });
      return;
    }

    await get().loadQuestion();
  },

  /**
   * Reset toàn bộ Learn state
   */
  reset: () => {
    set({
      sessionId: null,
      state: "idle",
      question: null,
      result: null,
      stepCount: 0,
      totalSteps: 0,
      phase: "learn",
      error: undefined,
    });
  },
}));