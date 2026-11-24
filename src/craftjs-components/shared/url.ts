/**
 * safeUrl — Chỉ trả về URL an toàn để render vào href / src.
 * Cho phép http(s), mailto:, tel:, đường dẫn tương đối và anchor; chặn
 * javascript:, data:, vbscript:... (trả undefined).
 *
 * Back-end đã validate khi lưu (validateCraftJson), đây là lớp chặn thứ 2 cho
 * dữ liệu lưu từ trước khi có validate.
 */
const SAFE_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i

export const safeUrl = (url?: string | null): string | undefined => {
  const value = url?.trim()
  return value && SAFE_URL.test(value) ? value : undefined
}
