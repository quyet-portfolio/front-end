// Nguồn duy nhất cho mọi URL tuyệt đối trong metadata, sitemap và robots.
// Canonical, og:url và sitemap đều nối thẳng chuỗi này nên nó phải là origin đầy
// đủ (có scheme) và không có dấu "/" ở cuối — nếu không sẽ sinh ra URL "//blogs".
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')

export const SITE_NAME = 'Quyetdaik'

export const SITE_DESCRIPTION =
  'Portfolio and blog of Quyet — front-end engineer writing about web performance, Next.js, Shopify apps and everyday life.'

// Ngôn ngữ của phần blog. Phần portfolio viết bằng tiếng Anh nên <html lang> ở
// root vẫn là "en"; các trang blog tự khai báo lại locale của mình.
export const BLOG_LOCALE = 'vi_VN'
export const BLOG_LANG = 'vi'

export const absoluteUrl = (path: string): string => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

// Phần Notes (flashcard) viết bằng tiếng Anh — trùng với <html lang="en"> ở root
// nên không cần khai báo lại `lang` như trang blog.
export const NOTES_LOCALE = 'en_US'

export const NOTES_DESCRIPTION =
  'Flashcard sets for learning vocabulary and technical terms — flip through cards, quiz yourself, and track what you have mastered.'
