import { CalendarClock, MapPin, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { completeTask, driverTasks, getActiveTaskIds } from '@/pages/driver/driverData';
import { styles } from './Active.styles';
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
          <div className={styles.style}>
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
          <header className={styles.style2}>
            <h2 className={styles.sectionTitle2}>{task.id}</h2>
            <p className={styles.mutedText}>{task.orderId}</p>
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
