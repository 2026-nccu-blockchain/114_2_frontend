import { useEffect } from 'react';
import { getCompletedTaskIds, mapOrderToDriverTask } from '@/pages/driver/driverData';
import { useOrderStore } from '@/store/orderStore';
import '@/styles/pages/driver/Completed.css';
export default function DriverCompleted() {
  const { orders, fetchMyOrders, isLoading, error } = useOrderStore();
  const completedTaskIds = getCompletedTaskIds();
  const completedTasks = orders
    .map(mapOrderToDriverTask)
    .filter((task) => completedTaskIds.includes(task.id) || task.distance === 'arrived');

  useEffect(() => {
    void fetchMyOrders();
  }, [fetchMyOrders]);

  return (
    <div className="driverCompleted__page">
      <header>
        <p className="driverCompleted__eyebrow">Completed</p>
        <h1 className="driverCompleted__title">Completed tasks</h1>
      </header>

      {isLoading ? (
        <div className="driverCompleted__empty">Loading completed tasks...</div>
      ) : error ? (
        <div className="driverCompleted__empty">{error}</div>
      ) : completedTasks.length > 0 ? (
        <section className="driverCompleted__list">
          {completedTasks.map((task) => (
            <article key={task.id} className="driverCompleted__card">
              <div className="driverCompleted__cardTop">
                <div>
                  <p className="driverCompleted__cardTitle">{task.id}</p>
                  <p className="driverCompleted__cardMeta">{task.orderId}</p>
                </div>
                <span className="driverCompleted__badge">Arrived</span>
              </div>
              <div className="driverCompleted__cardFooter">
                <span>{task.createdAt}</span>
                <span>{task.customer}</span>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="driverCompleted__empty">Arrived tasks will appear here.</div>
      )}
    </div>
  );
}
