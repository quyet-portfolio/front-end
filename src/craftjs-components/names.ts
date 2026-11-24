/**
 * names.ts — Nguồn sự thật DUY NHẤT về danh sách element của Portfolio Builder.
 *
 * Tên ở đây = `resolvedName` lưu trong craftJson. Hai registry được type theo
 * danh sách này nên thiếu một element ở đâu là TypeScript báo lỗi ngay:
 *  - uiRegistry.ts  → UI thuần, dùng cho trang public / preview (không có @craftjs/core)
 *  - index.ts       → component editor (craftResolver) + palette ở sidebar
 *
 * Thêm element mới: thêm tên vào đây → tsc sẽ chỉ ra các chỗ còn thiếu.
 * Nhớ cập nhật ALLOWED_COMPONENTS ở back-end (portfolioController) để server chấp nhận.
 */
export const CRAFT_COMPONENT_NAMES = [
  'CraftContainer',
  'HeroSection',
  'AboutSection',
  'SkillsSection',
  'ProjectsSection',
  'ExperienceSection',
  'ContactSection',
  'Divider',
  'TextNode',
  'ColumnsLayout',
  'ButtonNode',
  'ImageNode',
  'IconNode',
] as const

export type CraftComponentName = (typeof CRAFT_COMPONENT_NAMES)[number]
