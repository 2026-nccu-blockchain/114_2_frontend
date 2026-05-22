import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Route, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { acceptTask as saveAcceptedTask, driverTasks } from '@/pages/driver/driverData';

const styles = {
  page: 'space-y-6',
  backLink: 'inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-teal-700',
  icon: 'h-4 w-4',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
  panel: 'rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
  detailHeader: 'flex items-start justify-between gap-4 border-b border-gray-100 pb-4',
  detailTitle: 'text-2xl font-bold text-gray-900',
  detailMeta: 'mt-1 text-sm text-gray-500',
  badge: 'rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700',
  section: 'border-b border-gray-100 py-4 last:border-b-0',
  sectionTitle: 'mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900',
  sectionIcon: 'h-4 w-4 text-teal-600',
  infoGrid: 'grid gap-3 text-sm md:grid-cols-2',
  infoLabel: 'text-gray-500',
  infoValue: 'mt-1 font-medium text-gray-900',
  itemRow: 'flex items-center justify-between gap-4 py-2 text-sm',
  itemName: 'font-medium text-gray-800',
  itemDetail: 'text-gray-500',
  actions: 'mt-5 flex flex-col gap-3 sm:flex-row',
  primaryButton:
    'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-700',
  secondaryButton:
    'inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700',
};

export default function DriverTaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = driverTasks.find((currentTask) => currentTask.id === taskId);

  const handleAcceptTask = () => {
    if (!task) return;

    saveAcceptedTask(task.id);
    navigate('/active');
  };

  if (!task) {
    return (
      <div className={styles.page}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft className={styles.icon} />
          Back to tasks
        </Link>
        <div className={styles.empty}>Task not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeft className={styles.icon} />
        Back to tasks
      </Link>

      <section className={styles.panel}>
        <div className={styles.detailHeader}>
          <div>
            <h1 className={styles.detailTitle}>{task.id}</h1>
            <p className={styles.detailMeta}>{task.orderId}</p>
          </div>
          <span className={styles.badge}>{task.distance}</span>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <CalendarClock className={styles.sectionIcon} />
            Order time
          </h2>
          <p className={styles.infoValue}>{task.createdAt}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <MapPin className={styles.sectionIcon} />
            Delivery route
          </h2>
          <div className={styles.infoGrid}>
            <div>
              <p className={styles.infoLabel}>From</p>
              <p className={styles.infoValue}>{task.from}</p>
            </div>
            <div>
              <p className={styles.infoLabel}>To</p>
              <p className={styles.infoValue}>{task.to}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <PackageCheck className={styles.sectionIcon} />
            Order items
          </h2>
          {task.items.map((item) => (
            <div key={item.name} className={styles.itemRow}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemDetail}>{item.quantity}</p>
            </div>
          ))}
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={handleAcceptTask}>
            <Truck className={styles.icon} />
            Accept Task
          </button>
          <Link to="/" className={styles.secondaryButton}>
            <Route className={styles.icon} />
            Back
          </Link>
        </div>
      </section>
    </div>
  );
}
