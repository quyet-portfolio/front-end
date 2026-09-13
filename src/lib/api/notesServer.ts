import { cache } from 'react'
import { FlashCard, FlashCardsResponse } from '@/src/app/section/Notes/types'

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '')

// Danh sách chỉ đổi khi có bộ thẻ mới — vài phút là đủ tươi, lại tránh được cold
// start của back-end ở mỗi lượt mở /notes.
const LIST_REVALIDATE_SECONDS = 300

// Sitemap chỉ đổi khi có bộ thẻ mới được tạo.
const SITEMAP_REVALIDATE_SECONDS = 3600

// `limit` của GET /api/flashcards bị validator chặn ở 100.
const SITEMAP_PAGE_SIZE = 100

// Chặn vòng lặp vô hạn nếu API trả `hasNextPage` sai. 50 trang = 5.000 bộ thẻ.
const SITEMAP_MAX_PAGES = 50

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
 * Bọc `cache()` vì cả `generateMetadata` lẫn page đều gọi hàm này trong cùng một
 * lượt render — một request duy nhất thay vì hai.
 *
 * Phân biệt "không tồn tại" với "API chết": cái đầu đáng trả 404, cái sau thì để
 * client tự thử lại chứ không được biến một bộ thẻ hợp lệ thành trang 404.
 */
export const getFlashCardForPage = cache(async (id: string): Promise<FlashCardFetchResult> => {
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
})

/**
 * Trang đầu của danh sách cho lần render đầu ở /notes.
 *
 * Không có nó thì HTML server chỉ chứa spinner — nghĩa là không có link <a> nào
 * trỏ tới trang chi tiết cho tới khi JS chạy, và crawler không có đường nào đi
 * vào từng bộ thẻ ngoài sitemap.
 */
export async function getFlashCardsForList(limit: number): Promise<FlashCardsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/flashcards?page=1&limit=${limit}`, {
      next: { revalidate: LIST_REVALIDATE_SECONDS },
    })
    if (!res.ok) return null
    return (await res.json()) as FlashCardsResponse
  } catch {
    // Client sẽ tự fetch lại — mất SSR ở lần này nhưng trang vẫn dùng được.
    return null
  }
}

/** Toàn bộ bộ thẻ, dùng để dựng sitemap.xml. */
export async function getFlashCardsForSitemap(): Promise<FlashCard[]> {
  const flashcards: FlashCard[] = []

  try {
    for (let page = 1; page <= SITEMAP_MAX_PAGES; page += 1) {
      const res = await fetch(`${API_URL}/flashcards?limit=${SITEMAP_PAGE_SIZE}&page=${page}`, {
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      })
      if (!res.ok) break

      const data = (await res.json()) as FlashCardsResponse
      flashcards.push(...(data.flashcards ?? []))
      if (!data.pagination?.hasNextPage) break
    }
  } catch {
    // Trả về phần đã lấy được: sitemap thiếu bộ thẻ vẫn tốt hơn sitemap lỗi 500.
  }

  return flashcards
}
