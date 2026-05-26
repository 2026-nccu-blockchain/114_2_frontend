import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Route, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { acceptTask as saveAcceptedTask, driverTasks } from '@/pages/driver/driverData';
import { styles } from './TaskDetail.styles';
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
