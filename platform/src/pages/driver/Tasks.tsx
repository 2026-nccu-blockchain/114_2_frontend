import { Link } from 'react-router-dom';
import { driverTasks, getActiveTaskIds, getCompletedTaskIds } from '@/pages/driver/driverData';
import '@/styles/pages/driver/Tasks.css';
export default function DriverTasks() {
  const activeTaskIds = getActiveTaskIds();
  const completedTaskIds = getCompletedTaskIds();
  const availableTasks = driverTasks.filter((task) => !activeTaskIds.includes(task.id) && !completedTaskIds.includes(task.id));

  return (
    <div className="driverTasks__page">
      <header className="driverTasks__header">
        <div>
          <p className="driverTasks__eyebrow">Driver Tasks</p>
          <h1 className="driverTasks__title">Available tasks</h1>
          <p className="driverTasks__subtitle">Open a task to review order details and delivery addresses.</p>
        </div>
      </header>

      {availableTasks.length > 0 ? (
        <section className="driverTasks__list">
          {availableTasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="driverTasks__card">
              <div className="driverTasks__cardTop">
                <div>
                  <p className="driverTasks__cardTitle">{task.id}</p>
                  <p className="driverTasks__cardMeta">{task.orderId}</p>
                </div>
                <span className="driverTasks__badge">{task.distance}</span>
              </div>

              <div className="driverTasks__cardFooter">
                <span>{task.createdAt}</span>
                <span>{task.customer}</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="driverTasks__empty">No available tasks right now.</div>
      )}
    </div>
  );
}
