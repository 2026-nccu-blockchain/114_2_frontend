import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Truck, XCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { initialOrders, statusStyles } from '@/pages/seller/orderData';

const styles = {
  page: 'space-y-6',
  backLink: 'inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-teal-700',
  backIcon: 'h-4 w-4',
  panel: 'rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
  detailHeader: 'flex items-start justify-between gap-4 border-b border-gray-100 pb-4',
  detailTitle: 'text-2xl font-bold text-gray-900',
  detailMeta: 'mt-1 text-sm text-gray-500',
  status: 'rounded-full px-2.5 py-1 text-xs font-medium',
  section: 'border-b border-gray-100 py-4 last:border-b-0',
  sectionTitle: 'mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900',
  sectionIcon: 'h-4 w-4 text-teal-600',
  itemRow: 'flex items-center justify-between gap-4 py-2 text-sm',
  itemName: 'font-medium text-gray-800',
  itemDetail: 'text-gray-500',
  total: 'text-sm font-semibold text-gray-900',
  infoGrid: 'grid gap-3 text-sm md:grid-cols-2',
  infoLabel: 'text-gray-500',
  infoValue: 'mt-1 font-medium text-gray-900',
  actions: 'mt-5 flex flex-col gap-3 sm:flex-row',
  assignButton:
    'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700',
  cancelButton:
    'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50',
  actionIcon: 'h-4 w-4',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
};

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
