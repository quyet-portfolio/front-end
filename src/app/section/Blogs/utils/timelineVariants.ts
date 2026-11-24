import { Variants } from 'framer-motion'

/**
 * Variants đặt ở module scope để không cấp phát lại mỗi lần render.
 *
 * Chỉ group root mới gắn `whileInView`; các phần tử con nhận trạng thái qua
 * variants + staggerChildren. Nếu để mỗi phần tử tự `whileInView` thì framer sẽ
 * tạo một IntersectionObserver cho MỖI phần tử — 500 bài là ~2000 observer.
 */
export const groupVariants: Variants = {
  hidden: {},
  visible: {},
}

export const trunkVariants: Variants = {
  hidden: { height: 0 },
  visible: { height: '100%', transition: { duration: 0.5, ease: 'easeOut' } },
}

export const nodeVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: 'backOut' } },
}

export const branchVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.3 } },
}

export const dateLabelVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

// `custom` mang cờ isLeft xuống từ group root
export const cardVariants: Variants = {
  hidden: (isLeft: boolean) => ({ opacity: 0, y: 24, x: isLeft ? 24 : -24 }),
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}
