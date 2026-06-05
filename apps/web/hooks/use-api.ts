import { useState, useEffect, useCallback } from 'react'

interface UseApiOptions<T> {
  initialData?: T
  deps?: unknown[]
}

export function useApi<T>(
  fetcher: () => Promise<{ data: { data: T } }>,
  options: UseApiOptions<T> = {},
) {
  const [data, setData] = useState<T | undefined>(options.initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetcher()
      setData(res.data.data)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'حدث خطأ في جلب البيانات')
    } finally {
      setLoading(false)
    }
  }, options.deps ?? [])  // eslint-disable-line

  useEffect(() => { fetch() }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useApiMutation<TInput, TOutput>(
  mutator: (input: TInput) => Promise<{ data: { data: TOutput; message?: string } }>,
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (input: TInput): Promise<TOutput | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await mutator(input)
      return res.data.data
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'حدث خطأ')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
