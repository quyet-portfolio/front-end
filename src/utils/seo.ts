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

  return clipMetaDescription(text)
}

/** Cắt về độ dài meta description theo ranh giới từ. Không đụng tới nội dung. */
function clipMetaDescription(text: string): string | undefined {
  if (!text) return undefined
  if (text.length <= META_DESCRIPTION_MAX) return text

  const clipped = text.slice(0, META_DESCRIPTION_MAX - 1)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${(lastSpace > 80 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\s]+$/, '')}…`
}

/** Số term nêu tên trong mô tả tự sinh — đủ gợi nội dung mà không vượt 160 ký tự. */
const FLASHCARD_DESCRIPTION_SAMPLE_TERMS = 4

/**
 * Meta description cho một bộ thẻ, luôn bằng tiếng Anh.
 *
 * Mô tả do tác giả nhập được ưu tiên. Phần lớn bộ thẻ để trống ô này, nên khi đó
 * dựng một câu từ số lượng và vài term đầu — cụ thể hơn hẳn một câu chung chung
 * dùng lại cho mọi bộ thẻ, thứ Google sẽ coi là mô tả trùng lặp.
 */
export function toFlashcardDescription(flashcard: {
  title: string
  description?: string
  terms: Array<{ term: string }>
}): string | undefined {
  const authored = toMetaDescription(flashcard.description)
  if (authored) return authored

  // `?? []`: metadata không được phép làm sập trang chỉ vì API trả thiếu field.
  const terms = flashcard.terms ?? []
  const count = terms.length
  // Chỉ gộp khoảng trắng, KHÔNG chạy qua toMetaDescription: bộ lọc thẻ HTML ở đó
  // nuốt mất những term hợp lệ như "<div>" trong bộ thẻ lập trình web, để lại
  // chuỗi kiểu "useState, , useMemo". Next tự escape giá trị thuộc tính meta.
  const clean = (value: string) => value.replace(/\s+/g, ' ').trim()
  const title = clean(flashcard.title)

  if (count === 0) return clipMetaDescription(`"${title}" flashcard set.`)

  const sample = terms
    .map((t) => clean(t.term))
    .filter(Boolean)
    .slice(0, FLASHCARD_DESCRIPTION_SAMPLE_TERMS)
    .join(', ')
  const more = count > FLASHCARD_DESCRIPTION_SAMPLE_TERMS ? ' and more' : ''

  return clipMetaDescription(
    `Learn "${title}" with ${count} flashcard${count === 1 ? '' : 's'}: ${sample}${more}. Flip the cards, quiz yourself and track your mastery.`,
  )
}
