import { FlashCard } from '@/src/app/section/Notes/types'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

export type FlashCardFetchResult =
  | { status: 'ok'; flashcard: FlashCard }
  /** Server nói rõ là không có bộ thẻ này. */
  | { status: 'not-found' }
  /** API lỗi hoặc không gọi được — khác hẳn "không tồn tại". */
  | { status: 'unavailable' }

/**
 * Lấy bộ thẻ ngay trong lần render đầu ở server.
 *
 * Trước đây trang chi tiết là một client component rỗng: trình duyệt nhận HTML chỉ
 * có spinner, rồi mới gọi API lần nữa. Fetch ở đây cho nội dung vào ngay HTML đầu
 * tiên và bỏ được một round-trip nối tiếp.
 *
 * `no-store` vì chủ bộ thẻ vừa bấm Save là phải thấy thay đổi ngay; cache dù chỉ
 * vài giây cũng khiến trang chi tiết trông như lưu hụt.
 *
 * Phân biệt "không tồn tại" với "API chết": cái đầu đáng trả 404, cái sau thì để
 * client tự thử lại chứ không được biến một bộ thẻ hợp lệ thành trang 404.
 */
export async function getFlashCardForPage(id: string): Promise<FlashCardFetchResult> {
  try {
    const res = await fetch(`${API_URL}/flashcards/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    })

    if (res.status === 404 || res.status === 400) return { status: 'not-found' }
    if (!res.ok) return { status: 'unavailable' }

    const data = (await res.json()) as { flashcard?: FlashCard }
    return data.flashcard ? { status: 'ok', flashcard: data.flashcard } : { status: 'not-found' }
  } catch {
    return { status: 'unavailable' }
  }
}
