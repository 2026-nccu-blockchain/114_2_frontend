import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { initialOrders, statusOptions, statusStyles, type OrderStatus } from '@/pages/seller/orderData';
import { styles } from './Orders.styles';
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
