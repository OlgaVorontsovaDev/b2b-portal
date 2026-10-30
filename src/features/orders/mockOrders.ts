import type { Order, OrderStatus } from './types'

// Распределение по статусам: 'processing' пуст (проверка пустого состояния),
// 'delivered' = 23 — не кратно 10 (проверка неполной последней страницы).
const STATUS_COUNTS: [OrderStatus, number][] = [
  ['delivered', 23],
  ['shipped', 9],
  ['cancelled', 8],
  ['new', 5],
  ['processing', 0],
]

const TOTAL = 45
const DAY_MS = 24 * 60 * 60 * 1000
const NEWEST = Date.UTC(2026, 9, 28, 12, 0, 0)

const statusPool: OrderStatus[] = STATUS_COUNTS.flatMap(([status, count]) =>
  Array.from({ length: count }, () => status),
)

// 7 взаимно просто с 45, поэтому статусы перемешиваются детерминированно
export const mockOrders: Order[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: `ORD-${String(10045 - i)}`,
  createdAt: new Date(NEWEST - i * 1.7 * DAY_MS).toISOString(),
  status: statusPool[(i * 7) % TOTAL],
  amount: (((i * 7919) % 90000) + 5000) * 10,
}))
