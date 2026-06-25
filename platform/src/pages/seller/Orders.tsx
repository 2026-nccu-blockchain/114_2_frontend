import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { statusOptions, statusStyles } from '@/constants/order';
import { useOrderStore } from '@/store/orderStore';
import { type OrderStatusFilter } from '@/types';
import '@/styles/pages/seller/Orders.css';
export default function SellerOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const { orders, fetchMyOrders, isLoading, error } = useOrderStore();

  useEffect(() => {
    void fetchMyOrders();
  }, [fetchMyOrders]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => statusFilter === 'all' || order.status === statusFilter),
    [orders, statusFilter],
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
            onChange={(event) => setStatusFilter(event.target.value as OrderStatusFilter)}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {isLoading ? (
        <div className="sellerOrders__empty">Loading orders...</div>
      ) : error ? (
        <div className="sellerOrders__empty">{error}</div>
      ) : filteredOrders.length > 0 ? (
        <section className="sellerOrders__list">
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`} className="sellerOrders__orderCard">
              <div className="sellerOrders__orderTop">
                <div>
                  <p className="sellerOrders__orderId">{order.oid ? `Order ${order.oid}` : 'Order'}</p>
                  <p className="sellerOrders__orderMeta">Customer order</p>
                </div>
                <span className={`${'sellerOrders__status'} ${statusStyles[order.status]}`}>{order.status}</span>
              </div>

              <div className="sellerOrders__orderFooter">
                <span className="sellerOrders__orderMeta">{order.createdAt || 'Order time unavailable'}</span>
                <span className="sellerOrders__total">${order.total.toFixed(2)}</span>
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
