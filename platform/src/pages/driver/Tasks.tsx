import { Link } from 'react-router-dom';
import { driverTasks, getActiveTaskIds, getCompletedTaskIds } from '@/pages/driver/driverData';

const styles = {
  page: 'space-y-6',
  header: 'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  subtitle: 'mt-1 text-sm text-gray-500',
  list: 'grid gap-3',
  card: 'block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-teal-300 hover:bg-teal-50',
  cardTop: 'flex items-start justify-between gap-4',
  cardTitle: 'font-semibold text-gray-900',
  cardMeta: 'mt-1 text-sm text-gray-500',
  cardFooter: 'mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600',
  badge: 'rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
};

export default function DriverTasks() {
  const activeTaskIds = getActiveTaskIds();
  const completedTaskIds = getCompletedTaskIds();
  const availableTasks = driverTasks.filter((task) => !activeTaskIds.includes(task.id) && !completedTaskIds.includes(task.id));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Driver Tasks</p>
          <h1 className={styles.title}>Available tasks</h1>
          <p className={styles.subtitle}>Open a task to review order details and delivery addresses.</p>
        </div>
      </header>

      {availableTasks.length > 0 ? (
        <section className={styles.list}>
          {availableTasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardTitle}>{task.id}</p>
                  <p className={styles.cardMeta}>{task.orderId}</p>
                </div>
                <span className={styles.badge}>{task.distance}</span>
              </div>

              <div className={styles.cardFooter}>
                <span>{task.createdAt}</span>
                <span>{task.customer}</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className={styles.empty}>No available tasks right now.</div>
      )}
    </div>
  );
}
