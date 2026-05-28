import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Truck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { initialOrders, statusStyles } from '@/pages/seller/orderData';
import { styles } from '@/styles/pages/seller/OrderDetail.styles';
export default function SellerOrderDetail() {
  const { orderId } = useParams();
  const order = initialOrders.find((currentOrder) => currentOrder.id === orderId);

  if (!order) {
    return (
      <div className={styles.page}>
        <Link to="/orders" className={styles.backLink}>
          <ArrowLeft className={styles.backIcon} />
          Back to orders
        </Link>
        <div className={styles.empty}>Order not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/orders" className={styles.backLink}>
        <ArrowLeft className={styles.backIcon} />
        Back to orders
      </Link>

      <section className={styles.panel}>
        <div className={styles.detailHeader}>
          <div>
            <h1 className={styles.detailTitle}>{order.id}</h1>
            <p className={styles.detailMeta}>{order.customer}</p>
          </div>
          <span className={`${styles.status} ${statusStyles[order.status]}`}>{order.status}</span>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <CalendarClock className={styles.sectionIcon} />
            Order time
          </h2>
          <p className={styles.infoValue}>{order.createdAt}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <PackageCheck className={styles.sectionIcon} />
            Order items
          </h2>
          {order.items.map((item) => (
            <div key={item.name} className={styles.itemRow}>
              <div>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemDetail}>Qty {item.quantity}</p>
              </div>
              <p className={styles.total}>{item.price}</p>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <MapPin className={styles.sectionIcon} />
            Delivery info
          </h2>
          <div className={styles.infoGrid}>
            <div>
              <p className={styles.infoLabel}>Recipient</p>
              <p className={styles.infoValue}>{order.delivery.recipient}</p>
            </div>
            <div>
              <p className={styles.infoLabel}>Phone</p>
              <p className={styles.infoValue}>{order.delivery.phone}</p>
            </div>
            <div>
              <p className={styles.infoLabel}>Address</p>
              <p className={styles.infoValue}>{order.delivery.address}</p>
            </div>
            <div>
              <p className={styles.infoLabel}>Driver</p>
              <p className={styles.infoValue}>{order.delivery.driver}</p>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          {order.status === 'ordered' && (
            <button type="button" className={styles.assignButton}>
              <Truck className={styles.actionIcon} />
              Assign
            </button>
          )}
          <button type="button" className={styles.cancelButton}>
            <XCircle className={styles.actionIcon} />
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
