import { ArrowLeft, CalendarClock, MapPin, PackageCheck, Route, Truck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { acceptTask as saveAcceptedTask, driverTasks } from '@/pages/driver/driverData';
import '@/styles/pages/driver/TaskDetail.css';
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
      <div className="driverTaskDetail__page">
        <Link to="/" className="driverTaskDetail__backLink">
          <ArrowLeft className="driverTaskDetail__icon" />
          Back to tasks
        </Link>
        <div className="driverTaskDetail__empty">Task not found.</div>
      </div>
    );
  }

  return (
    <div className="driverTaskDetail__page">
      <Link to="/" className="driverTaskDetail__backLink">
        <ArrowLeft className="driverTaskDetail__icon" />
        Back to tasks
      </Link>

      <section className="driverTaskDetail__panel">
        <div className="driverTaskDetail__detailHeader">
          <div>
            <h1 className="driverTaskDetail__detailTitle">{task.id}</h1>
            <p className="driverTaskDetail__detailMeta">{task.orderId}</p>
          </div>
          <span className="driverTaskDetail__badge">{task.distance}</span>
        </div>

        <section className="driverTaskDetail__section">
          <h2 className="driverTaskDetail__sectionTitle">
            <CalendarClock className="driverTaskDetail__sectionIcon" />
            Order time
          </h2>
          <p className="driverTaskDetail__infoValue">{task.createdAt}</p>
        </section>

        <section className="driverTaskDetail__section">
          <h2 className="driverTaskDetail__sectionTitle">
            <MapPin className="driverTaskDetail__sectionIcon" />
            Delivery route
          </h2>
          <div className="driverTaskDetail__infoGrid">
            <div>
              <p className="driverTaskDetail__infoLabel">From</p>
              <p className="driverTaskDetail__infoValue">{task.from}</p>
            </div>
            <div>
              <p className="driverTaskDetail__infoLabel">To</p>
              <p className="driverTaskDetail__infoValue">{task.to}</p>
            </div>
          </div>
        </section>

        <section className="driverTaskDetail__section">
          <h2 className="driverTaskDetail__sectionTitle">
            <PackageCheck className="driverTaskDetail__sectionIcon" />
            Order items
          </h2>
          {task.items.map((item) => (
            <div key={item.name} className="driverTaskDetail__itemRow">
              <p className="driverTaskDetail__itemName">{item.name}</p>
              <p className="driverTaskDetail__itemDetail">{item.quantity}</p>
            </div>
          ))}
        </section>

        <div className="driverTaskDetail__actions">
          <button type="button" className="driverTaskDetail__primaryButton" onClick={handleAcceptTask}>
            <Truck className="driverTaskDetail__icon" />
            Accept Task
          </button>
          <Link to="/" className="driverTaskDetail__secondaryButton">
            <Route className="driverTaskDetail__icon" />
            Back
          </Link>
        </div>
      </section>
    </div>
  );
}
