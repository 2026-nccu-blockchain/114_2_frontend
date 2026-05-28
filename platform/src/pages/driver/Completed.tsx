import { driverTasks, getCompletedTaskIds } from '@/pages/driver/driverData';
import { styles } from '@/styles/pages/driver/Completed.styles';
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
