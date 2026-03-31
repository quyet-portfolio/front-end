import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ăn Gì Hôm Nay? — AI Meal Planner | Quyet Portfolio',
  description:
    'Thực đơn giảm cân cá nhân hóa bằng AI. Phân tích BMI, TDEE, phân bổ macro và tự động tránh lặp món để thiết kế thực đơn tối ưu mỗi ngày.',
  openGraph: {
    title: 'Ăn Gì Hôm Nay? — AI Meal Planner',
    description:
      'Hệ thống AI thông minh thiết kế thực đơn giảm cân dựa trên chỉ số cơ thể, ngân sách và khẩu vị cá nhân.',
    type: 'website',
  },
}

export default function WhatToEatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
