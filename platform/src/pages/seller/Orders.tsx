import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { initialOrders, statusOptions, statusStyles, type OrderStatus } from '@/pages/seller/orderData';

const styles = {
  page: 'space-y-6',
  header: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  subtitle: 'mt-1 text-sm text-gray-500',
  filterField: 'space-y-1.5 sm:min-w-56',
  filterLabel: 'text-sm font-medium text-gray-700',
  select:
    'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500',
  list: 'grid gap-3',
  orderCard: 'block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50',
  orderTop: 'flex items-start justify-between gap-4',
  orderId: 'font-semibold text-gray-900',
  orderMeta: 'mt-1 text-sm text-gray-500',
  orderFooter: 'mt-4 flex flex-wrap items-center justify-between gap-3',
  total: 'text-sm font-semibold text-gray-900',
  status: 'rounded-full px-2.5 py-1 text-xs font-medium',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
};

export default function SellerOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');

  const filteredOrders = useMemo(
    () => initialOrders.filter((order) => statusFilter === 'all' || order.status === statusFilter),
    [statusFilter],
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Seller Orders</p>
          <h1 className={styles.title}>Order management</h1>
          {/* <p className={styles.subtitle}>Choose a status, then open an order to view full details.</p> */}
        </div>

        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="order-status">
            Status
          </label>
          <select
            id="order-status"
            className={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {filteredOrders.length > 0 ? (
        <section className={styles.list}>
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <div>
                  <p className={styles.orderId}>{order.id}</p>
                  <p className={styles.orderMeta}>{order.customer}</p>
                </div>
                <span className={`${styles.status} ${statusStyles[order.status]}`}>{order.status}</span>
              </div>

              <div className={styles.orderFooter}>
                <span className={styles.orderMeta}>{order.createdAt}</span>
                <span className={styles.total}>{order.total}</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className={styles.empty}>No orders match this status.</div>
      )}
    </div>
  );
}
