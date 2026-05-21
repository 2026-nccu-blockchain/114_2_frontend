import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';

export default function BuyerOrders() {
  const navigate = useNavigate();
  const { orders } = useOrderStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    Order #{order.id}
                  </h3>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{order.createdAt}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </p>
              </div>

              <div className="text-lg font-bold text-gray-900 self-end md:self-center">
                ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}