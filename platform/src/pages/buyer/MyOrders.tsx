import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { styles } from '@/styles/pages/buyer/MyOrders.styles';

export default function BuyerOrders() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.panel}>
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className={styles.page2}>
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className={styles.panel2}
            >
              <div>
                <div className={styles.style}>
                  <h3 className={styles.style2}>
                    Order #{order.id}
                  </h3>
                  <span className={styles.style3}>
                    {order.status}
                  </span>
                </div>
                <p className={styles.style4}>{order.createdAt}</p>
                <p className={styles.mutedText}>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </p>
              </div>

              <div className={styles.style5}>
                ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}