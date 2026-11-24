/**
 * tint — Màu `color` pha trong suốt `percent`%.
 * Dùng color-mix thay vì nối hậu tố alpha kiểu `${hex}20`: cách cũ hỏng khi
 * color là CSS var (vd 'var(--portfolio-primary, #6366F1)20' → CSS không hợp lệ).
 */
export const tint = (color: string, percent: number) =>
  `color-mix(in srgb, ${color} ${percent}%, transparent)`

/** Màu chữ mặc định của element = màu text của Global Theme */
export const TEXT_THEME_COLOR = 'var(--portfolio-text, #f8fafc)'
