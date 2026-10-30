export const ORDER_STATUSES = [
  'new',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

export interface Order {
  id: string
  /** Дата создания в формате ISO */
  createdAt: string
  status: OrderStatus
  /** Сумма в рублях, целое число */
  amount: number
}

export interface OrdersQuery {
  page: number
  pageSize: number
  /** Нет значения = «Все» */
  status?: OrderStatus
}

export interface OrdersPage {
  items: Order[]
  /** Общее число заказов, подходящих под фильтр */
  total: number
}
