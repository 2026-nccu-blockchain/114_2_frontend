import { CalendarClock, MapPin, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { completeTask, driverTasks, getActiveTaskIds } from '@/pages/driver/driverData';

const styles = {
  page: 'space-y-6',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
  panel: 'rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
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

export default function DriverActive() {
  const navigate = useNavigate();
  const activeTaskIds = getActiveTaskIds();
  const activeTasks = driverTasks.filter((task) => activeTaskIds.includes(task.id));

  const markArrived = (taskId: string) => {
    completeTask(taskId);
    if (getActiveTaskIds().length === 0) {
      navigate('/completed');
    }
  };

  if (activeTasks.length === 0) {
    return (
      <div className={styles.page}>
        <header>
          <p className={styles.eyebrow}>Active Delivery</p>
          <h1 className={styles.title}>No active task</h1>
        </header>
        <div className={styles.empty}>
          Accept a task from the available task list first.
          <div className="mt-4">
            <Link to="/" className={styles.secondaryButton}>
              View tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Active Delivery</p>
        <h1 className={styles.title}>Active tasks</h1>
      </header>

      {activeTasks.map((task) => (
        <section key={task.id} className={styles.panel}>
          <header className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">{task.id}</h2>
            <p className="mt-1 text-sm text-gray-500">{task.orderId}</p>
          </header>

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
              Route
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
                <p className={styles.itemDetail}> {item.quantity}</p>
              </div>
            ))}
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.primaryButton} onClick={() => markArrived(task.id)}>
              Arrived
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
