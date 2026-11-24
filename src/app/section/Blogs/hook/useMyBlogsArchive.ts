'use client'

import { useCallback, useEffect, useState } from 'react'
import { blogApi } from '@/src/lib/api/blog'
import { BlogArchiveYear, BlogStatusFilter } from '@/src/lib/types'

// Server phải gom nhóm theo đúng lịch local của trình duyệt, nếu không rail sẽ
// ghi năm khác với nhãn ngày hiển thị trên cây
function getBrowserTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return undefined
  }
}

export const useMyBlogsArchive = (status: BlogStatusFilter) => {
  const [years, setYears] = useState<BlogArchiveYear[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchArchive = useCallback(async () => {
    try {
      setLoading(true)
      const data = await blogApi.getMyBlogsArchive({ status, tz: getBrowserTimeZone() })
      setYears(data.years)
    } catch {
      // Rail chỉ là tiện ích bổ trợ — lỗi thì đơn giản là không render
      setYears([])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchArchive()
  }, [fetchArchive])

  return { years, loading, refetchArchive: fetchArchive }
}
