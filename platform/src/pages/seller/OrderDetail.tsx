import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Truck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { initialOrders, statusStyles } from '@/pages/seller/orderData';
import '@/styles/pages/seller/OrderDetail.css';
export default function SellerOrderDetail() {
  const { orderId } = useParams();
  const order = initialOrders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return (
      <div className="sellerOrderDetail__page">
        <Link to="/orders" className="sellerOrderDetail__backLink">
          <ArrowLeft className="sellerOrderDetail__backIcon" />
          Back to orders
        </Link>
        <div className="sellerOrderDetail__empty">Order not found.</div>
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
            <h1 className="sellerOrderDetail__detailTitle">{order.id}</h1>
            <p className="sellerOrderDetail__detailMeta">{order.customer}</p>
          </div>
          <span className={`${'sellerOrderDetail__status'} ${statusStyles[order.status]}`}>{order.status}</span>
        </div>

        <section className="sellerOrderDetail__section">
          <h2 className="sellerOrderDetail__sectionTitle">
            <CalendarClock className="sellerOrderDetail__sectionIcon" />
            Order time
          </h2>
          <p className="sellerOrderDetail__infoValue">{order.createdAt}</p>
        </section>

        <section className="sellerOrderDetail__section">
          <h2 className="sellerOrderDetail__sectionTitle">
            <PackageCheck className="sellerOrderDetail__sectionIcon" />
            Order items
          </h2>
          {order.items.map((item) => (
            <div key={item.name} className="sellerOrderDetail__itemRow">
              <div>
                <p className="sellerOrderDetail__itemName">{item.name}</p>
                <p className="sellerOrderDetail__itemDetail">Qty {item.quantity}</p>
              </div>
              <p className="sellerOrderDetail__total">{item.price}</p>
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
              <p className="sellerOrderDetail__infoLabel">Recipient</p>
              <p className="sellerOrderDetail__infoValue">{order.delivery.recipient}</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">Phone</p>
              <p className="sellerOrderDetail__infoValue">{order.delivery.phone}</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">Address</p>
              <p className="sellerOrderDetail__infoValue">{order.delivery.address}</p>
            </div>
            <div>
              <p className="sellerOrderDetail__infoLabel">Driver</p>
              <p className="sellerOrderDetail__infoValue">{order.delivery.driver}</p>
            </div>
          </div>
        </section>

        <div className="sellerOrderDetail__actions">
          {order.status === 'ordered' && (
            <button type="button" className="sellerOrderDetail__assignButton">
              <Truck className="sellerOrderDetail__actionIcon" />
              Assign
            </button>
          )}
          <button type="button" className="sellerOrderDetail__cancelButton">
            <XCircle className="sellerOrderDetail__actionIcon" />
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
