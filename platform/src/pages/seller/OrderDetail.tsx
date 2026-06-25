import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Truck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { statusStyles } from '@/constants/order';
import { useOrderStore } from '@/store/orderStore';
import '@/styles/pages/seller/OrderDetail.css';
export default function SellerOrderDetail() {
  const { orderId, id } = useParams();
  const currentOrderId = orderId ?? id;
  const {
    selectedOrder,
    isLoading,
    error,
    fetchOrderById,
    getOrderById,
    updateOrderStatus,
  } = useOrderStore();
  const cachedOrder = getOrderById(currentOrderId || '');
  const order = selectedOrder?.id === currentOrderId ? selectedOrder : cachedOrder;

  useEffect(() => {
    if (currentOrderId) {
      void fetchOrderById(currentOrderId, { requireItems: true });
    }
  }, [fetchOrderById, currentOrderId]);

  const handleUpdateStatus = async (status: 'success' | 'packed' | 'fail') => {
    if (!currentOrderId) return;

    try {
      await updateOrderStatus(currentOrderId, status);
      toast.success('Order status updated.');
    } catch {
      toast.error('Failed to update order status.');
    }
  };

  if (isLoading && !order) {
    return (
      <div className="sellerOrderDetail__page">
        <Link to="/orders" className="sellerOrderDetail__backLink">
          <ArrowLeft className="sellerOrderDetail__backIcon" />
          Back to orders
        </Link>
        <div className="sellerOrderDetail__empty">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="sellerOrderDetail__page">
        <Link to="/orders" className="sellerOrderDetail__backLink">
          <ArrowLeft className="sellerOrderDetail__backIcon" />
          Back to orders
        </Link>
        <div className="sellerOrderDetail__empty">{error || 'Order not found.'}</div>
      </div>
    );
  }

  return (
    <div className="sellerOrderDetail__page">
      <Link to="/orders" className="sellerOrderDetail__backLink">
        <ArrowLeft className="sellerOrderDetail__backIcon" />
        Back to orders
      </Link>

      <section className="sellerOrderDetail__panel">
        <div className="sellerOrderDetail__detailHeader">
          <div>
            <h1 className="sellerOrderDetail__detailTitle">{order.oid ? `Order ${order.oid}` : 'Order detail'}</h1>
            <p className="sellerOrderDetail__detailMeta">Customer order</p>
          </div>
          <span className={`${'sellerOrderDetail__status'} ${statusStyles[order.status]}`}>{order.status}</span>
        </div>

        <section className="sellerOrderDetail__section">
          <h2 className="sellerOrderDetail__sectionTitle">
            <CalendarClock className="sellerOrderDetail__sectionIcon" />
            Order time
          </h2>
          <p className="sellerOrderDetail__infoValue">{order.createdAt || 'Order time unavailable'}</p>
        </section>

        <section className="sellerOrderDetail__section">
          <h2 className="sellerOrderDetail__sectionTitle">
            <PackageCheck className="sellerOrderDetail__sectionIcon" />
            Order items
          </h2>
          {order.items.map((item) => (
            <div key={item.id} className="sellerOrderDetail__itemRow">
              <div>
                <p className="sellerOrderDetail__itemName">{item.name}</p>
                <p className="sellerOrderDetail__itemDetail">Qty {item.quantity}</p>
              </div>
              <p className="sellerOrderDetail__total">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </section>

        <section className="sellerOrderDetail__section">
          <h2 className="sellerOrderDetail__sectionTitle">
            <MapPin className="sellerOrderDetail__sectionIcon" />
            Delivery info
          </h2>
          <div className="sellerOrderDetail__infoGrid">
            <div>
              <p className="sellerOrderDetail__infoLabel">Customer</p>
              <p className="sellerOrderDetail__infoValue">Buyer</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">From</p>
              <p className="sellerOrderDetail__infoValue">{order.fromAddress || 'Unavailable'}</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">Address</p>
              <p className="sellerOrderDetail__infoValue">{order.toAddress}</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">Driver</p>
              <p className="sellerOrderDetail__infoValue">{order.driverId ? 'Assigned' : 'Unassigned'}</p>
            </div>
          </div>
        </section>

        <div className="sellerOrderDetail__actions">
          {order.status === 'ordered' && (
            <button
              type="button"
              className="sellerOrderDetail__assignButton"
              disabled={isLoading}
              onClick={() => void handleUpdateStatus('success')}
            >
              <Truck className="sellerOrderDetail__actionIcon" />
              Confirm order
            </button>
          )}
          {order.status === 'success' && (
            <button
              type="button"
              className="sellerOrderDetail__assignButton"
              disabled={isLoading}
              onClick={() => void handleUpdateStatus('packed')}
            >
              <Truck className="sellerOrderDetail__actionIcon" />
              Mark packed
            </button>
          )}
          <button
            type="button"
            className="sellerOrderDetail__cancelButton"
            disabled={isLoading}
            onClick={() => void handleUpdateStatus('fail')}
          >
            <XCircle className="sellerOrderDetail__actionIcon" />
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
