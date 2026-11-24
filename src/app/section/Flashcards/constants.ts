/**
 * Số bộ thẻ mỗi trang ở /flashcards.
 *
 * Nằm trong file thuần thay vì store.ts: server component của /flashcards cần đúng số
 * này để dựng sẵn trang đầu, mà import store sẽ kéo cả zustand lẫn axios client
 * vào bundle phía server.
 */
export const FLASHCARDS_PAGE_SIZE = 10
