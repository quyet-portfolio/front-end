// Slug rules must stay in sync with the backend validator in back-end/routes/blog.ts
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Convert a title to a URL-safe slug (Vietnamese diacritics are stripped)
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
