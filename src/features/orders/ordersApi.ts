import { mockOrders } from './mockOrders'
import type { OrdersPage, OrdersQuery } from './types'

let pendingFailures = 0

/** Заставляет следующие `count` вызовов fetchOrders завершиться ошибкой. */
export function simulateOrdersError(count = 1) {
  pendingFailures = count
}

if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).ordersApi = {
    fetchOrders,
    simulateOrdersError,
  }
}

function abortError() {
  return new DOMException('Запрос отменён', 'AbortError')
}

export function fetchOrders(
  { page, pageSize, status }: OrdersQuery,
  signal?: AbortSignal,
): Promise<OrdersPage> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const onAbort = () => {
      clearTimeout(timer)
      reject(abortError())
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)

      if (pendingFailures > 0) {
        pendingFailures--
        reject(new Error('Не удалось загрузить заказы'))
        return
      }

      const filtered = mockOrders
        .filter((order) => !status || order.status === status)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      const start = (page - 1) * pageSize

      resolve({
        items: filtered.slice(start, start + pageSize),
        total: filtered.length,
      })
    }, 300 + Math.random() * 300)

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}
