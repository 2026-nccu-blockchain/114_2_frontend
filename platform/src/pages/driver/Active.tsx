import { CalendarClock, MapPin, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { completeTask, driverTasks, getActiveTaskIds } from '@/pages/driver/driverData';
import '@/styles/pages/driver/Active.css';
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
      <div className="driverActive__page">
        <header>
          <p className="driverActive__eyebrow">Active Delivery</p>
          <h1 className="driverActive__title">No active task</h1>
        </header>
        <div className="driverActive__empty">
          Accept a task from the available task list first.
          <div className="driverActive__style">
            <Link to="/" className="driverActive__secondaryButton">
              View tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driverActive__page">
      <header>
        <p className="driverActive__eyebrow">Active Delivery</p>
        <h1 className="driverActive__title">Active tasks</h1>
      </header>

      {activeTasks.map((task) => (
        <section key={task.id} className="driverActive__panel">
          <header className="driverActive__style2">
            <h2 className="driverActive__sectionTitle2">{task.id}</h2>
            <p className="driverActive__mutedText">{task.orderId}</p>
          </header>

          <section className="driverActive__section">
            <h2 className="driverActive__sectionTitle">
              <CalendarClock className="driverActive__sectionIcon" />
              Order time
            </h2>
            <p className="driverActive__infoValue">{task.createdAt}</p>
          </section>

          <section className="driverActive__section">
            <h2 className="driverActive__sectionTitle">
              <MapPin className="driverActive__sectionIcon" />
              Route
            </h2>
            <div className="driverActive__infoGrid">
              <div>
                <p className="driverActive__infoLabel">From</p>
                <p className="driverActive__infoValue">{task.from}</p>
              </div>
              <div>
                <p className="driverActive__infoLabel">To</p>
                <p className="driverActive__infoValue">{task.to}</p>
              </div>
            </div>
          </section>

          <section className="driverActive__section">
            <h2 className="driverActive__sectionTitle">
              <PackageCheck className="driverActive__sectionIcon" />
              Order items
            </h2>
            {task.items.map((item) => (
              <div key={item.name} className="driverActive__itemRow">
                <p className="driverActive__itemName">{item.name}</p>
                <p className="driverActive__itemDetail"> {item.quantity}</p>
              </div>
            ))}
          </section>

          <div className="driverActive__actions">
            <button type="button" className="driverActive__primaryButton" onClick={() => markArrived(task.id)}>
              Arrived
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
