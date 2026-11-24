/**
 * theme.ts — Global Theme của portfolio → CSS variables.
 *
 * Dùng chung cho editor canvas (.pf-canvas), preview và trang public (.pf-root)
 * để 3 nơi render giống hệt nhau. Element *UI đọc var(--portfolio-*) làm mặc định;
 * prop riêng của element (override) thắng khi được set.
 *
 * Token phái sinh (muted / surface / border) được tính từ màu text bằng
 * color-mix nên tự đúng cho cả theme sáng lẫn tối.
 */

export interface PortfolioTheme {
  colors?: { primary?: string; background?: string; text?: string; [key: string]: string | undefined }
  font?: { heading?: string; body?: string }
}

/** Google Fonts được hỗ trợ (load runtime qua buildGoogleFontsHref) */
export const FONT_OPTIONS = ['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lora', 'Playfair Display']

export const DEFAULT_THEME = {
  colors: { primary: '#6366F1', background: '#0f172a', text: '#f8fafc' },
  font: { heading: 'Inter', body: 'Inter' },
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/
const FONT_NAME = /^[A-Za-z0-9 ]{1,40}$/

/** Chỉ nhận giá trị an toàn để chèn vào <style> — còn lại dùng mặc định. */
const safeColor = (value: string | undefined, fallback: string) =>
  value && HEX_COLOR.test(value) ? value : fallback
const safeFont = (value: string | undefined, fallback: string) =>
  value && FONT_NAME.test(value) ? value : fallback

export function resolveTheme(theme?: PortfolioTheme | null) {
  return {
    primary: safeColor(theme?.colors?.primary, DEFAULT_THEME.colors.primary),
    background: safeColor(theme?.colors?.background, DEFAULT_THEME.colors.background),
    text: safeColor(theme?.colors?.text, DEFAULT_THEME.colors.text),
    headingFont: safeFont(theme?.font?.heading, DEFAULT_THEME.font.heading),
    bodyFont: safeFont(theme?.font?.body, DEFAULT_THEME.font.body),
  }
}

/** CSS khai báo token theme + nền/màu chữ/font cho một scope (vd `.pf-root`). */
export function buildThemeCss(selector: string, theme?: PortfolioTheme | null): string {
  const t = resolveTheme(theme)
  return `
    ${selector} {
      --portfolio-primary: ${t.primary};
      --portfolio-bg: ${t.background};
      --portfolio-text: ${t.text};
      --portfolio-muted: color-mix(in srgb, ${t.text} 68%, transparent);
      --portfolio-surface: color-mix(in srgb, ${t.text} 5%, transparent);
      --portfolio-border: color-mix(in srgb, ${t.text} 16%, transparent);
      --portfolio-heading-font: '${t.headingFont}', sans-serif;
      --portfolio-body-font: '${t.bodyFont}', sans-serif;
      background: var(--portfolio-bg);
      color: var(--portfolio-text);
      font-family: var(--portfolio-body-font);
      /* Khung chứa cho variant pf-sm / pf-md / pf-lg (tailwind.config.ts) */
      container-type: inline-size;
    }
    ${selector} h1, ${selector} h2, ${selector} h3, ${selector} h4 {
      font-family: var(--portfolio-heading-font);
    }
  `
}

/** Google Fonts <link> href cho heading + body family (dedupe). */
export function buildGoogleFontsHref(theme?: PortfolioTheme | null): string {
  const t = resolveTheme(theme)
  const families = Array.from(new Set([t.headingFont, t.bodyFont]))
  const params = families
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;600;700;800`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}
