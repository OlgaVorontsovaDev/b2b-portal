import { OrdersTable } from './OrdersTable'
import { Pagination } from './Pagination'
import { StatusFilter } from './StatusFilter'
import './OrderHistoryPage.css'
import { useOrders } from './useOrders'

export function OrderHistoryPage() {
  const { page, setPage, status, setStatus, retry, request, totalPages } =
    useOrders()

  return (
    <section className="order-history">
      <h1>История заказов</h1>

      <StatusFilter value={status} onChange={setStatus} />

      {request.state === 'loading' && (
        <p role="status" className="order-history__message">
          Загрузка заказов…
        </p>
      )}

      {request.state === 'error' && (
        <div role="alert" className="order-history__message">
          <p>Не удалось загрузить заказы</p>
          <button type="button" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {request.state === 'success' && request.data.items.length === 0 && (
        <p role="status" className="order-history__message">
          Заказы не найдены
        </p>
      )}

      {request.state === 'success' && request.data.items.length > 0 && (
        <>
          <OrdersTable items={request.data.items} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  )
}
