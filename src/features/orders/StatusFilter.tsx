import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from './types'

const ALL = ''

interface StatusFilterProps {
  value: OrderStatus | undefined
  onChange: (status: OrderStatus | undefined) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="status-filter">
      <label htmlFor="status-filter">Статус</label>
      <select
        id="status-filter"
        value={value ?? ALL}
        onChange={(event) => {
          const next = event.target.value
          onChange(next === ALL ? undefined : (next as OrderStatus))
        }}
      >
        <option value={ALL}>Все</option>
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  )
}
