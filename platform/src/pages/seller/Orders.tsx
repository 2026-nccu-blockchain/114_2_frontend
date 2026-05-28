import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { initialOrders, statusOptions, statusStyles, type OrderStatus } from '@/pages/seller/orderData';
import '@/styles/pages/seller/Orders.css';
export default function SellerOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');

  const filteredOrders = useMemo(
    () => initialOrders.filter((order) => statusFilter === 'all' || order.status === statusFilter),
    [statusFilter],
  );

  return (
    <div className="sellerOrders__page">
      <header className="sellerOrders__header">
        <div>
          <p className="sellerOrders__eyebrow">Seller Orders</p>
          <h1 className="sellerOrders__title">Order management</h1>
         
        </div>

        <div className="sellerOrders__filterField">
          <label className="sellerOrders__filterLabel" htmlFor="order-status">
            Status
          </label>
          <select
            id="order-status"
            className="sellerOrders__select"
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
        <section className="sellerOrders__list">
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="sellerOrders__orderCard">
              <div className="sellerOrders__orderTop">
                <div>
                  <p className="sellerOrders__orderId">{order.id}</p>
                  <p className="sellerOrders__orderMeta">{order.customer}</p>
                </div>
                <span className={`${'sellerOrders__status'} ${statusStyles[order.status]}`}>{order.status}</span>
              </div>

              <div className="sellerOrders__orderFooter">
                <span className="sellerOrders__orderMeta">{order.createdAt}</span>
                <span className="sellerOrders__total">{order.total}</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="sellerOrders__empty">No orders match this status.</div>
      )}
    </div>
  );
}
