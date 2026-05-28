import { Link } from 'react-router-dom';
import { driverTasks, getActiveTaskIds, getCompletedTaskIds } from '@/pages/driver/driverData';
import { styles } from '@/styles/pages/driver/Tasks.styles';
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
