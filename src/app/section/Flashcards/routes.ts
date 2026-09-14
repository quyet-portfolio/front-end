/**
 * Mọi đường dẫn của tính năng Flashcards.
 *
 * Trước đây "/notes" được gõ tay ở 27 chỗ trong 16 file — đổi tên tính năng là
 * phải săn từng chỗ, sót một cái là ra link chết. File thuần, không phụ thuộc
 * client, nên dùng được cả trong server component, sitemap và robots.
 */
export const FLASHCARDS_PATH = '/flashcards'

/**
 * Tiền tố cũ. Chỉ còn được dùng để khai báo redirect vĩnh viễn trong
 * next.config.mjs — URL cũ đã nằm trong sitemap production nên phải giữ lâu dài.
 */
export const LEGACY_FLASHCARDS_PATH = '/notes'

export const flashcardsRoutes = {
  list: FLASHCARDS_PATH,
  create: `${FLASHCARDS_PATH}/create`,
  detail: (id: string) => `${FLASHCARDS_PATH}/${id}`,
  edit: (id: string) => `${FLASHCARDS_PATH}/edit/${id}`,
  learn: (id: string) => `${FLASHCARDS_PATH}/${id}/learn`,
} as const
