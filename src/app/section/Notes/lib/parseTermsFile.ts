import { ITerm } from '../types'

export type TermsFileType = 'csv' | 'json' | 'xlsx'

/** Phải khớp với giới hạn ở BE (routes/FlashCard/flashCard.ts). */
export const MAX_TERMS_PER_FLASHCARD = 1000

const TERM_HEADERS = ['term', 'từ', 'word', 'phrase']
const DEFINITION_HEADERS = ['definition', 'định nghĩa', 'meaning', 'nghĩa']
const RELATED_HEADERS = ['related', 'liên quan', 'extra']

/**
 * Tách một dòng CSV, tôn trọng dấu ngoặc kép và escape `""`.
 *
 * Bản này phải khớp từng ký tự với `parseCSVLine` ở back-end. Trước đây FE dùng
 * `line.split(',')` thô sơ, nên file có dấu phẩy trong ngoặc kép ("Hello, world")
 * cho preview một đằng còn kết quả import ra một nẻo — người dùng chỉ phát hiện
 * sau khi đã ghi vào DB.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // bỏ qua dấu nháy thứ hai
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

export function parseCSV(content: string): ITerm[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== '')

  if (lines.length < 2) {
    throw new Error('CSV must have at least a header row and one data row')
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim())

  const termIndex = headers.findIndex((h) => TERM_HEADERS.includes(h))
  const defIndex = headers.findIndex((h) => DEFINITION_HEADERS.includes(h))
  const relatedIndex = headers.findIndex((h) => RELATED_HEADERS.includes(h))

  if (termIndex === -1 || defIndex === -1) {
    throw new Error("CSV must have 'term' and 'definition' columns")
  }

  const terms: ITerm[] = []

  for (let i = 1; i < lines.length; i++) {
    const columns = parseCSVLine(lines[i])
    if (columns.length <= Math.max(termIndex, defIndex)) continue

    const term = columns[termIndex]?.trim() || ''
    const definition = columns[defIndex]?.trim() || ''
    const related = relatedIndex >= 0 ? columns[relatedIndex]?.trim() || '' : ''

    if (term && definition) {
      terms.push({ term, definition, related })
    }
  }

  return terms
}

export function parseJSON(content: string): ITerm[] {
  let data: unknown

  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('Invalid JSON format')
  }

  if (!Array.isArray(data)) {
    throw new Error('JSON must be an array of objects')
  }

  const pick = (item: Record<string, unknown>, keys: string[]): string => {
    const key = keys.find((k) => item[k])
    return key ? String(item[key]).trim() : ''
  }

  return data
    .map((item: Record<string, unknown>) => ({
      term: pick(item, TERM_HEADERS),
      definition: pick(item, DEFINITION_HEADERS),
      related: pick(item, RELATED_HEADERS),
    }))
    .filter((t) => t.term !== '' && t.definition !== '')
}

export type ParseTermsResult =
  /** Parse được — `terms` là đúng thứ BE sẽ ghi vào DB. */
  | { status: 'ok'; terms: ITerm[] }
  /** xlsx chỉ đọc được ở server (cần thư viện `xlsx`), FE không preview. */
  | { status: 'preview-unavailable' }
  /** File hỏng — hiện luôn cho user thay vì im lặng trả về mảng rỗng. */
  | { status: 'error'; message: string }

export function parseTermsFile(content: string, fileType: TermsFileType): ParseTermsResult {
  if (fileType === 'xlsx') return { status: 'preview-unavailable' }

  try {
    const terms = fileType === 'csv' ? parseCSV(content) : parseJSON(content)
    return { status: 'ok', terms }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Could not read this file',
    }
  }
}

export function detectFileType(filename: string): TermsFileType | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (ext === 'csv') return 'csv'
  if (ext === 'json') return 'json'
  if (ext === 'xlsx' || ext === 'xls') return 'xlsx'
  return null
}

const SAMPLE_TERMS: ITerm[] = [
  { term: 'Hello', definition: 'A common greeting', related: 'Greeting' },
  { term: 'Goodbye', definition: 'A parting phrase', related: 'Farewell' },
  { term: 'Thank you', definition: 'An expression of gratitude', related: 'Polite expression' },
  { term: 'Computer', definition: 'An electronic computing device', related: 'Electronic device' },
  { term: 'Book', definition: 'A written or printed work', related: 'Reading material' },
]

export const SAMPLE_CSV = [
  'term,definition,related',
  ...SAMPLE_TERMS.map((t) => `${t.term},${t.definition},${t.related}`),
].join('\n')

export const SAMPLE_JSON = JSON.stringify(SAMPLE_TERMS, null, 2)

/** Tải một chuỗi về máy dưới dạng file, dọn object URL sau khi trình duyệt nhận. */
export function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
