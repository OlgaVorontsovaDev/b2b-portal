import { ORDER_STATUS_LABELS, type Order } from './types'

const dateFormatter = new Intl.DateTimeFormat('ru-RU')
const amountFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
})

interface OrdersTableProps {
  items: Order[]
}

export function OrdersTable({ items }: OrdersTableProps) {
  return (
    <table className="orders-table">
      <thead>
        <tr>
          <th scope="col">Номер</th>
          <th scope="col">Дата</th>
          <th scope="col">Статус</th>
          <th scope="col">Сумма</th>
        </tr>
      </thead>
      <tbody>
        {items.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>
              <time dateTime={order.createdAt}>
                {dateFormatter.format(new Date(order.createdAt))}
              </time>
            </td>
            <td>{ORDER_STATUS_LABELS[order.status]}</td>
            <td>{amountFormatter.format(order.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
