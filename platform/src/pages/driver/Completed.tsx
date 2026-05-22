import { driverTasks, getCompletedTaskIds } from '@/pages/driver/driverData';

const styles = {
  page: 'space-y-6',
  eyebrow: 'text-sm font-medium text-teal-700',
  title: 'mt-1 text-2xl font-bold text-gray-900',
  list: 'grid gap-3',
  card: 'block rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
  cardTop: 'flex items-start justify-between gap-4',
  cardTitle: 'font-semibold text-gray-900',
  cardMeta: 'mt-1 text-sm text-gray-500',
  cardFooter: 'mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600',
  badge: 'rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700',
  empty: 'rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500',
};

export default function DriverCompleted() {
  const completedTaskIds = getCompletedTaskIds();
  const completedTasks = driverTasks.filter((task) => completedTaskIds.includes(task.id));

  return (
    <div className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Completed</p>
        <h1 className={styles.title}>Completed tasks</h1>
      </header>

      {completedTasks.length > 0 ? (
        <section className={styles.list}>
          {completedTasks.map((task) => (
            <article key={task.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.cardTitle}>{task.id}</p>
                  <p className={styles.cardMeta}>{task.orderId}</p>
                </div>
                <span className={styles.badge}>Arrived</span>
              </div>
              <div className={styles.cardFooter}>
                <span>{task.createdAt}</span>
                <span>{task.customer}</span>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className={styles.empty}>Arrived tasks will appear here.</div>
      )}
    </div>
  );
}
