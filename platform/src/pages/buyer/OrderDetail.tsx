import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';

export default function BuyerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getOrderById = useOrderStore((state) => state.getOrderById);

  const order = getOrderById(id || '');

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Order not found.</p>
        <button onClick={() => navigate('/orders')} className="text-teal-600 hover:underline mt-2">
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 返回按鈕 */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to orders
      </button>

      {/* 頂部標題與狀態 */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="text-sm text-gray-400 mt-1">{order.createdAt}</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
          {order.status}
        </span>
      </div>

      {/* 品項明細 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 text-gray-400">Items</h2>
          <ul className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between text-sm">
                <span className="text-gray-800">{item.name} <span className="text-gray-400 text-xs">x {item.quantity}</span></span>
                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center font-bold text-gray-900">
            <span>Total</span>
            <span className="text-lg">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送資訊 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 text-gray-400">Delivery Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400 text-xs">Recipient</p>
            <p className="text-gray-900 font-medium mt-0.5">{order.recipientName}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Phone</p>
            <p className="text-gray-900 font-medium mt-0.5">{order.phone}</p>
          </div>
        </div>
        <div className="text-sm space-y-4">
          <div>
            <p className="text-gray-400 text-xs">Address</p>
            <p className="text-gray-900 font-medium mt-0.5">{order.address}</p>
          </div>
          {order.notes && (
            <div>
              <p className="text-gray-400 text-xs">Notes</p>
              <p className="text-gray-600 mt-0.5">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* 司機配送進度 */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 text-gray-400">Delivery Tracking</h2>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Status:</span>
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {order.trackingStatus}
          </span>
        </div>
        
        {/* 時間軸外觀 */}
        <div className="relative border-l-2 border-teal-500 pl-4 ml-2 pb-2">
          <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-teal-500 border border-white" />
          <p className="text-sm font-medium text-gray-900">Assigned</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.createdAt}</p>
        </div>
      </div>
      
      <p className="text-center text-[11px] text-gray-400 mt-8">Payment Method: Cash on Delivery (COD)</p>
    </div>
  );
}