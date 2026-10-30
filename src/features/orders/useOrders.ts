import { useCallback, useEffect, useState } from 'react'
import { fetchOrders } from './ordersApi'
import type { OrdersPage, OrderStatus } from './types'

export const PAGE_SIZE = 10

type RequestState =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'success'; data: OrdersPage }

interface Settled {
  key: string
  result: { state: 'error' } | { state: 'success'; data: OrdersPage }
}

export function useOrders() {
  const [page, setPage] = useState(1)
  const [status, setStatusState] = useState<OrderStatus | undefined>()
  const [retryKey, setRetryKey] = useState(0)
  const [settled, setSettled] = useState<Settled | null>(null)

  const requestKey = `${page}|${status ?? ''}|${retryKey}`

  useEffect(() => {
    const controller = new AbortController()

    fetchOrders({ page, pageSize: PAGE_SIZE, status }, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSettled({ key: requestKey, result: { state: 'success', data } })
        }
      })
      .catch(() => {
        // Результат отменённого (устаревшего) запроса игнорируется
        if (!controller.signal.aborted) {
          setSettled({ key: requestKey, result: { state: 'error' } })
        }
      })

    return () => controller.abort()
  }, [page, status, requestKey])

  // Пока ответ на текущие параметры не получен, состояние — loading
  const request: RequestState =
    settled?.key === requestKey ? settled.result : { state: 'loading' }

  const setStatus = useCallback((next: OrderStatus | undefined) => {
    setStatusState(next)
    setPage(1)
  }, [])

  const retry = useCallback(() => setRetryKey((key) => key + 1), [])

  const total = request.state === 'success' ? request.data.total : 0

  return {
    page,
    setPage,
    status,
    setStatus,
    retry,
    request,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}
