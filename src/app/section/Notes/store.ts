import { GetFlashCardsParams, learnApi } from "@/src/lib/api/notes";
import { create } from "zustand";
import {
  AnswerResult,
  LearnQuestion,
  LearnProgress,
  LearnSessionStats,
  LearnState,
} from "./types";

interface LearnStore {
  // ===== STATE =====
  sessionId: string | null;
  state: LearnState;

  question: LearnQuestion | null;
  result: AnswerResult | null;

  /** Tổng kết phiên học, chỉ nạp khi đã hoàn thành. */
  stats: LearnSessionStats | null;
  statsLoading: boolean;

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
  skip: () => Promise<void>;
  next: () => Promise<void>;
  reset: () => void;
  clearAutoNext: () => void;
}

/**
 * Nạp tổng kết khi phiên học kết thúc.
 *
 * `learnApi.getStats` đã có sẵn từ đầu nhưng chưa nơi nào gọi: màn hình kết thúc
 * chỉ chúc mừng suông trong khi server vẫn tính đủ số câu đúng/sai/bỏ qua, độ
 * chính xác, thời gian trả lời trung bình và độ thuộc.
 */
async function finish(get: LearnGet, set: LearnSet): Promise<void> {
  const { sessionId } = get();
  set({ state: "completed", question: null, autoNextTimeoutId: null });

  if (!sessionId) return;

  set({ statsLoading: true });
  try {
    set({ stats: await learnApi.getStats(sessionId) });
  } catch {
    // Không có tổng kết thì vẫn hiện màn chúc mừng — hỏng chỗ này không đáng
    // biến cả phiên học vừa hoàn thành thành màn hình lỗi.
    set({ stats: null });
  } finally {
    set({ statsLoading: false });
  }
}

interface FlashCardsQueryStore extends GetFlashCardsParams {
  /**
   * Tăng lên để ép danh sách nạp lại.
   *
   * Sau khi import xong, trước đây code gọi `window.location.reload()` — nạp lại
   * cả trang, mất hết state và nháy trắng màn hình — chỉ vì modal import nằm ở
   * component anh em với danh sách nên không gọi refetch trực tiếp được.
   */
  refreshToken: number;

  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  refresh: () => void;
  resetQuery: () => void;
}

const INITIAL_QUERY = {
  page: 1,
  limit: 10,
  search: undefined as string | undefined,
  createdBy: undefined as string | undefined,
};

export const useFlashCardsStore = create<FlashCardsQueryStore>((set) => ({
  ...INITIAL_QUERY,
  refreshToken: 0,

  // Đổi từ khoá thì phải về trang 1: giữ nguyên page cũ dễ rơi vào trang trống
  // khi kết quả mới ít hơn.
  setSearch: (search) => set({ search: search || undefined, page: 1 }),
  setPage: (page) => set({ page }),
  refresh: () => set((state) => ({ refreshToken: state.refreshToken + 1 })),
  resetQuery: () => set({ ...INITIAL_QUERY }),
}));

/**
 * Lấy câu lỗi server gửi kèm. Vài lỗi ở đây là lỗi hành động được — "bộ thẻ đã đổi
 * kể từ lúc bắt đầu, hãy reset" — nên nuốt hết thành "Failed to..." là lấy mất của
 * người dùng thứ duy nhất giúp họ thoát ra.
 */
function readApiError(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return typeof message === "string" && message ? message : fallback;
}

type LearnSet = (partial: Partial<LearnStore>) => void;
type LearnGet = () => LearnStore;

const AUTO_NEXT_DELAY_MS = 2000;

/**
 * Gửi một lượt (trả lời hoặc bỏ qua) rồi chuyển sang màn feedback.
 *
 * `submit` và `skip` chỉ khác nhau ở payload, nên dùng chung một đường đi —
 * tránh việc sửa logic timeout ở một chỗ mà quên chỗ kia.
 */
async function sendAnswer(
  get: LearnGet,
  set: LearnSet,
  payload: { answer?: string; skipped?: boolean },
): Promise<void> {
  const { sessionId, state, questionStartTime, autoNextTimeoutId } = get();
  if (!sessionId || state !== "question") return;

  if (autoNextTimeoutId) clearTimeout(autoNextTimeoutId);

  try {
    const result: AnswerResult = await learnApi.submitAnswer(sessionId, {
      ...payload,
      elapsedMs: Math.max(Date.now() - questionStartTime, 0),
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

    // Chỉ tự sang câu kế khi ĐÚNG. Sai hoặc bỏ qua thì màn feedback đang hiện đáp
    // án đúng — cướp màn hình sau 2 giây là lấy mất đúng thứ người học cần đọc.
    if (result.correct && !result.completed) {
      const timeoutId = setTimeout(() => {
        const current = get();
        if (current.state === "feedback" && current.result?.correct) {
          current.loadQuestion();
        }
      }, AUTO_NEXT_DELAY_MS);

      set({ autoNextTimeoutId: timeoutId });
    }
  } catch (error) {
    set({
      state: "error",
      error: readApiError(error, "Submit failed"),
      autoNextTimeoutId: null,
    });
  }
}

export const useLearnStore = create<LearnStore>((set, get) => ({
  // ===== INITIAL =====
  sessionId: null,
  state: "idle",

  question: null,
  result: null,

  stats: null,
  statsLoading: false,

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
        stats: null,
        statsLoading: false,
        stepCount: 0,
        totalSteps: 0,
        phase: "learn",
        progress: null,
        questionStartTime: 0,
        autoNextTimeoutId: null,
      });

      await get().loadQuestion();
    } catch (error) {
      set({ state: "error", error: readApiError(error, "Failed to start session") });
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
        await finish(get, set);
        return;
      }

      // Record start time for response time tracking
      const startTime = Date.now();
      
      set({
        question,
        state: "question",
        questionStartTime: startTime,
        progress: question.progress,
        phase: question.phase,
        stepCount: question.stepCount,
        totalSteps: question.totalSteps,
      });
    } catch (error) {
      set({ state: "error", error: readApiError(error, "Failed to load question") });
    }
  },

  /**
   * Submit answer with response time tracking
   */
  submit: async (answer) => {
    await sendAnswer(get, set, { answer });
  },

  /**
   * Bỏ qua term hiện tại ("I don't know").
   *
   * Server đẩy con trỏ đi và trả về đáp án đúng, nên người học không kẹt lại
   * vĩnh viễn ở một câu gõ mãi không ra.
   */
  skip: async () => {
    await sendAnswer(get, set, { skipped: true });
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
      await finish(get, set);
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
      stats: null,
      statsLoading: false,
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
