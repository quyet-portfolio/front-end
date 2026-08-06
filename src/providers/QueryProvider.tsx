'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// staleTime > 0 là thứ khiến việc quay lại một trang đã xem không gọi API nữa.
// Để 0 (mặc định) thì cache chỉ tránh được màn hình trắng chứ vẫn bắn request.
const DEFAULT_STALE_TIME = 60 * 1000
const DEFAULT_GC_TIME = 5 * 60 * 1000

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_GC_TIME,
        refetchOnWindowFocus: false,
        // 401/403/404 retry lại là vô nghĩa — chỉ làm người dùng chờ lâu hơn
        retry: (failureCount, error: any) => {
          const status = error?.response?.status
          if (status && status >= 400 && status < 500) return false
          return failureCount < 2
        },
      },
    },
  })
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Tạo trong state, KHÔNG để ngoài module: giữ cho mỗi request SSR một client
  // riêng, tránh rò rỉ dữ liệu người dùng này sang người dùng khác.
  const [queryClient] = useState(createQueryClient)

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
