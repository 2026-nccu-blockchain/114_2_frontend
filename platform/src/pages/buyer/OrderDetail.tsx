import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import '@/styles/pages/buyer/OrderDetail.css';

export default function BuyerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedOrder, isLoading, error, fetchOrderById, getOrderById } = useOrderStore();

  const cachedOrder = getOrderById(id || '');
  const order = selectedOrder?.id === id ? selectedOrder : cachedOrder;

  useEffect(() => {
    if (id) {
      void fetchOrderById(id);
    }
  }, [fetchOrderById, id]);

  if (isLoading && !order) {
    return (
      <div className="buyerOrderDetail__style">
        <p className="buyerOrderDetail__style2">Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="buyerOrderDetail__style">
        <p className="buyerOrderDetail__style2">{error}</p>
        <button onClick={() => navigate('/orders')} className="buyerOrderDetail__primaryButton">
          Back to orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="buyerOrderDetail__style">
        <p className="buyerOrderDetail__style2">Order not found.</p>
        <button onClick={() => navigate('/orders')} className="buyerOrderDetail__primaryButton">
          Back to orders
        </button>
      </div>
    );
  }

  return (
    <div className="buyerOrderDetail__page">
      {/* 返回按鈕 */}
      <button
        onClick={() => navigate('/orders')}
        className="buyerOrderDetail__mutedText"
      >
        <ArrowLeft className="buyerOrderDetail__icon" />
        Back to orders
      </button>

      {/* 頂部標題與狀態 */}
      <div className="buyerOrderDetail__style3">
        <div>
          <h1 className="buyerOrderDetail__title">{order.oid ? `Order ${order.oid}` : 'Order detail'}</h1>
          <p className="buyerOrderDetail__style4">{order.createdAt || 'Order time unavailable'}</p>
        </div>
        <span className="buyerOrderDetail__style5">
          {order.status}
        </span>
      </div>

      {/* 品項明細 */}
      <div className="buyerOrderDetail__panel">
        <div className="buyerOrderDetail__style6">
          <h2 className="buyerOrderDetail__style7">Items</h2>
          <ul className="buyerOrderDetail__style8">
            {order.items.map((item) => (
              <li key={item.id} className="buyerOrderDetail__style9">
                <span className="buyerOrderDetail__style10">{item.name} <span className="buyerOrderDetail__style11">x {item.quantity}</span></span>
                <span className="buyerOrderDetail__style12">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="buyerOrderDetail__style13">
            <span>Total</span>
            <span className="buyerOrderDetail__style14">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 運送資訊 */}
      <div className="buyerOrderDetail__panel2">
        <h2 className="buyerOrderDetail__style7">Delivery Information</h2>
        <div className="buyerOrderDetail__style15">
          <div>
            <p className="buyerOrderDetail__style11">Recipient</p>
            <p className="buyerOrderDetail__style16">You</p>
          </div>
          <div>
            <p className="buyerOrderDetail__style11">Seller</p>
            <p className="buyerOrderDetail__style16">Assigned seller</p>
          </div>
        </div>
        <div className="buyerOrderDetail__page2">
          <div>
            <p className="buyerOrderDetail__style11">Address</p>
            <p className="buyerOrderDetail__style16">{order.toAddress}</p>
          </div>
          {order.fromAddress && (
            <div>
              <p className="buyerOrderDetail__style11">From</p>
              <p className="buyerOrderDetail__style17">{order.fromAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* 司機配送進度 */}
      <div className="buyerOrderDetail__panel3">
        <h2 className="buyerOrderDetail__style7">Delivery Tracking</h2>
        <div className="buyerOrderDetail__style18">
          <span className="buyerOrderDetail__mutedText2">Status:</span>
          <span className="buyerOrderDetail__style19">
            {order.status}
          </span>
        </div>
        
        {/* 時間軸外觀 */}
        <div className="buyerOrderDetail__style20">
          <div className="buyerOrderDetail__style21" />
          <p className="buyerOrderDetail__style22">{order.driverId ? 'Assigned' : 'Unassigned'}</p>
          <p className="buyerOrderDetail__style23">{order.createdAt || 'Order time unavailable'}</p>
        </div>
      </div>
      
      <p className="buyerOrderDetail__style24">Payment Method: Cash on Delivery (COD)</p>
    </div>
  );
}
