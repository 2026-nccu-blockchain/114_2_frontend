import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import '@/styles/pages/buyer/MyOrders.css';

export default function BuyerOrders() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();

  return (
    <div className="buyerMyOrders__page">
      <h1 className="buyerMyOrders__title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="buyerMyOrders__panel">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="buyerMyOrders__page2">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="group buyerMyOrders__panel2"
            >
              <div>
                <div className="buyerMyOrders__style">
                  <h3 className="buyerMyOrders__style2">
                    Order #{order.id}
                  </h3>
                  <span className="buyerMyOrders__style3">
                    {order.status}
                  </span>
                </div>
                <p className="buyerMyOrders__style4">{order.createdAt}</p>
                <p className="buyerMyOrders__mutedText">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </p>
              </div>

              <div className="buyerMyOrders__style5">
                ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}