import { recoverEscapedHtml } from './htmlContent'

// Google cắt meta description quanh mốc 160 ký tự. Cắt sẵn ở đây để đoạn mô tả
// luôn kết thúc trọn vẹn thay vì bị SERP xén giữa từ.
const META_DESCRIPTION_MAX = 160

// Entity hay lọt ra từ nội dung CKEditor. `buildExcerpt` ở back-end chỉ gỡ thẻ
// chứ không giải mã entity, nên excerpt trong DB có bài còn nguyên chuỗi "&nbsp;".
const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&quot;': '"',
  '&apos;': "'",
  '&#39;': "'",
  '&#x27;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
}

const decodeEntities = (value: string): string =>
  // "&amp;" đi cuối để chuỗi double-escaped chỉ giảm đúng một cấp.
  Object.entries(HTML_ENTITIES).reduce(
    (acc, [entity, char]) => acc.replace(new RegExp(entity, 'gi'), char),
    value,
  )

/**
 * Chuẩn hoá excerpt/nội dung bài thành meta description dùng được.
 *
 * Excerpt tự sinh ở back-end đã cắt cứng ở 200 ký tự và nối "..." — chuỗi đó
 * thường đứt giữa câu. Ở đây bỏ đuôi cắt cũ rồi cắt lại theo ranh giới từ, nên
 * mô tả hiển thị trên SERP luôn dừng ở một từ hoàn chỉnh.
 */
export function toMetaDescription(raw?: string | null): string | undefined {
  if (!raw) return undefined

  const text = decodeEntities(recoverEscapedHtml(raw))
    .replace(/```[\s\S]*?```/g, ' ') // fenced code block của bài markdown
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // giữ lại phần chữ của link/ảnh markdown
    .replace(/^[#>\s]+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(\.{3}|…)$/, '')
    .trim()

  if (!text) return undefined
  if (text.length <= META_DESCRIPTION_MAX) return text

  const clipped = text.slice(0, META_DESCRIPTION_MAX - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${(lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\s]+$/, '')}…`
}
