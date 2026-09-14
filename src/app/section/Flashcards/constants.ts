/**
 * Số bộ thẻ mỗi trang ở /notes.
 *
 * Nằm trong file thuần thay vì store.ts: server component của /notes cần đúng số
 * này để dựng sẵn trang đầu, mà import store sẽ kéo cả zustand lẫn axios client
 * vào bundle phía server.
 */
export const NOTES_PAGE_SIZE = 10
