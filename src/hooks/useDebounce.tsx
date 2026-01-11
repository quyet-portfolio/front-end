import { useState, useEffect } from 'react'

export function useDebounce(value: any, delay: number = 300) {
  const [debouncedValue, setDebouncedValue] = useState<any>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
